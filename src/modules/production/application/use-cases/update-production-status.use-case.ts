import { Injectable, Logger } from "@nestjs/common";
import { ProductionStatusEnum } from "../../domain/enums/production-status.enum";
import { ProductionStatusQueueProvider } from "@/providers/rabbitmq/providers/production-status-queue.provider";
import { ProductionQueueService } from "../services/production-queue.service";

@Injectable()
export class UpdateProductionStatusUseCase {
  private readonly logger = new Logger(UpdateProductionStatusUseCase.name);

  constructor(
    private readonly productionStatusQueueProvider: ProductionStatusQueueProvider,
    private readonly productionQueueService: ProductionQueueService,
  ) {}

  async execute(workOrderId: number, status: ProductionStatusEnum) {
    this.logger.log(`Atualizando status da OS ${workOrderId} para ${status}`);

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
