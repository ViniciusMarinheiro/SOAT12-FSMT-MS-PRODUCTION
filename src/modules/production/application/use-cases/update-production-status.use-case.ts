import {
  Injectable,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { ProductionStatusEnum } from "../../domain/enums/production-status.enum";
import { ProductionStatusQueueProvider } from "@/providers/rabbitmq/providers/production-status-queue.provider";
import { ProductionQueueService } from "../services/production-queue.service";

const STATUS_ORDER: Record<ProductionStatusEnum, number> = {
  [ProductionStatusEnum.QUEUED]: 0,
  [ProductionStatusEnum.IN_DIAGNOSIS]: 1,
  [ProductionStatusEnum.IN_REPAIR]: 2,
  [ProductionStatusEnum.COMPLETED]: 3,
};

@Injectable()
export class UpdateProductionStatusUseCase {
  private readonly logger = new Logger(UpdateProductionStatusUseCase.name);

  constructor(
    private readonly productionStatusQueueProvider: ProductionStatusQueueProvider,
    private readonly productionQueueService: ProductionQueueService,
  ) {}

  async execute(workOrderId: number, status: ProductionStatusEnum) {
    this.logger.log(`Atualizando status da OS ${workOrderId} para ${status}`);

    const currentItem =
      await this.productionQueueService.getItemByWorkOrderId(workOrderId);

    if (currentItem?.status === ProductionStatusEnum.COMPLETED) {
      throw new BadRequestException(
        `Ordem de serviço ${workOrderId} já está finalizada (COMPLETED). Não é possível alterar nem reenviar notificação.`,
      );
    }

    const currentOrder = currentItem
      ? STATUS_ORDER[currentItem.status]
      : -1;
    const newOrder = STATUS_ORDER[status];
    if (newOrder < currentOrder) {
      throw new BadRequestException(
        `Não é permitido voltar para status anterior. Status atual: ${currentItem?.status ?? "N/A"}. Solicitado: ${status}.`,
      );
    }

    try {
      await this.productionQueueService.updateItemStatus(workOrderId, status);

      const workOrderStatus = this.mapProductionStatusToWorkOrderStatus(status);

      if (status === ProductionStatusEnum.COMPLETED) {
        const now = new Date();
        await this.productionStatusQueueProvider.sendStatusUpdate({
          workOrderId,
          status: workOrderStatus,
          finishedAt: now,
        });
        this.logger.log(
          `Status da OS ${workOrderId} finalizado no BD e notificação enviada ao MS-ORDER`,
        );
      } else {
        this.logger.log(
          `Status da OS ${workOrderId} atualizado no BD para ${status} (apenas local)`,
        );
      }

      return {
        workOrderId,
        status: status,
        message: `Status da OS ${workOrderId} atualizado para ${status} no banco.`,
      };
    } catch (error) {
      this.logger.error(`Erro ao atualizar status da OS ${workOrderId}`, error);
      throw error;
    }
  }

  private mapProductionStatusToWorkOrderStatus(
    productionStatus: ProductionStatusEnum,
  ): string {
    const statusMap: Record<ProductionStatusEnum, string> = {
      [ProductionStatusEnum.QUEUED]: "RECEIVED",
      [ProductionStatusEnum.IN_DIAGNOSIS]: "DIAGNOSING",
      [ProductionStatusEnum.IN_REPAIR]: "IN_PROGRESS",
      [ProductionStatusEnum.COMPLETED]: "FINISHED",
    };

    return statusMap[productionStatus] || "RECEIVED";
  }
}
