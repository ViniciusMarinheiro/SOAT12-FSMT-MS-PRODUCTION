import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductionStatusEnum } from "../../domain/enums/production-status.enum";
import { ProductionQueueItem } from "../../infrastructure/database/production-queue-item.entity";

@Injectable()
export class ProductionQueueService {
  private readonly logger = new Logger(ProductionQueueService.name);

  constructor(
    @InjectRepository(ProductionQueueItem)
    private readonly repo: Repository<ProductionQueueItem>,
  ) {}

  async addWorkOrderToQueue(
    workOrderId: number,
    extra?: {
      customerId?: number;
      vehicleId?: number;
      protocol?: string;
      totalAmount?: number;
    },
  ): Promise<ProductionQueueItem> {
    const existing = await this.repo.findOne({
      where: { workOrderId, status: ProductionStatusEnum.QUEUED },
    });
    if (existing) {
      this.logger.debug(
        `OS ${workOrderId} já está na fila (ignorando duplicata)`,
      );
      return existing;
    }

    const alreadyProcessed = await this.repo.findOne({
      where: { workOrderId },
    });
    if (alreadyProcessed) {
      this.logger.log(
        `OS ${workOrderId} já existia; reenfileirando com status QUEUED`,
      );
      alreadyProcessed.status = ProductionStatusEnum.QUEUED;
      alreadyProcessed.customerId =
        extra?.customerId ?? alreadyProcessed.customerId;
      alreadyProcessed.vehicleId =
        extra?.vehicleId ?? alreadyProcessed.vehicleId;
      alreadyProcessed.protocol = extra?.protocol ?? alreadyProcessed.protocol;
      alreadyProcessed.totalAmount =
        extra?.totalAmount ?? alreadyProcessed.totalAmount;
      alreadyProcessed.startedAt = null;
      alreadyProcessed.completedAt = null;
      return this.repo.save(alreadyProcessed);
    }

    this.logger.log(`Adicionando OS ${workOrderId} à fila de produção`);
    return this.repo.save({
      workOrderId,
      customerId: extra?.customerId ?? null,
      vehicleId: extra?.vehicleId ?? null,
      protocol: extra?.protocol ?? null,
      totalAmount: extra?.totalAmount ?? null,
      status: ProductionStatusEnum.QUEUED,
    });
  }

  async getItemByWorkOrderId(
    workOrderId: number,
  ): Promise<ProductionQueueItem | null> {
    return this.repo.findOne({ where: { workOrderId } });
  }

  async removeFromQueueByWorkOrderId(workOrderId: number): Promise<boolean> {
    const result = await this.repo.delete({ workOrderId });
    this.logger.log(
      `OS ${workOrderId} removida da fila de produção (compensação saga)`,
    );
    return (result.affected ?? 0) > 0;
  }

  async updateItemStatus(
    workOrderId: number,
    status: ProductionStatusEnum,
  ): Promise<void> {
    let item = await this.repo.findOne({ where: { workOrderId } });
    if (!item) {
      this.logger.log(
        `OS ${workOrderId} não estava na fila; criando registro com status ${status}`,
      );
      item = this.repo.create({
        workOrderId,
        status,
        startedAt:
          status === ProductionStatusEnum.IN_DIAGNOSIS ||
          status === ProductionStatusEnum.IN_REPAIR ||
          status === ProductionStatusEnum.COMPLETED
            ? new Date()
            : null,
        completedAt:
          status === ProductionStatusEnum.COMPLETED ? new Date() : null,
      });
    } else {
      item.status = status;
      if (status === ProductionStatusEnum.IN_DIAGNOSIS && !item.startedAt) {
        item.startedAt = new Date();
      }
      if (status === ProductionStatusEnum.COMPLETED) {
        item.completedAt = new Date();
      }
    }
    await this.repo.save(item);
    this.logger.debug(`Status da OS ${workOrderId} atualizado para ${status}`);
  }

  async getQueueStatus() {
    const items = await this.repo.find({
      order: { createdAt: "ASC" },
    });

    const waiting = items.filter(
      (i) => i.status === ProductionStatusEnum.QUEUED,
    );
    const inDiagnosis = items.filter(
      (i) => i.status === ProductionStatusEnum.IN_DIAGNOSIS,
    );
    const inRepair = items.filter(
      (i) => i.status === ProductionStatusEnum.IN_REPAIR,
    );
    const completed = items.filter(
      (i) => i.status === ProductionStatusEnum.COMPLETED,
    );

    const mapItem = (item: ProductionQueueItem) => ({
      workOrderId: item.workOrderId,
      status: item.status,
      createdAt: item.createdAt,
      protocol: item.protocol,
    });

    return {
      waiting: waiting.length,
      inDiagnosis: inDiagnosis.length,
      inRepair: inRepair.length,
      completed: completed.length,
      jobs: {
        waiting: waiting.map(mapItem),
        inDiagnosis: inDiagnosis.map(mapItem),
        inRepair: inRepair.map(mapItem),
        completed: completed.map(mapItem),
      },
    };
  }
}
