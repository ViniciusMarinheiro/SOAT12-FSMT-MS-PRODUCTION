import { Injectable, Logger } from "@nestjs/common";
import { MessageHandler } from "../types/message.interface";
import { ProductionQueueService } from "@/modules/production/application/services/production-queue.service";
import { InvalidPayloadError } from "@/common/exceptions/invalidPayloadError";

export interface ReceiveWorkOrderPayload {
  workOrderId: number;
  customerId: number;
  vehicleId: number;
  protocol: string;
  totalAmount: number;
}

@Injectable()
export class ReceiveWorkOrderStrategy implements MessageHandler<ReceiveWorkOrderPayload> {
  protected readonly logger = new Logger(ReceiveWorkOrderStrategy.name);

  constructor(
    private readonly productionQueueService: ProductionQueueService,
  ) {}

  private validatePayload(
    payload: unknown,
  ): asserts payload is ReceiveWorkOrderPayload {
    if (!payload || typeof payload !== "object") {
      throw new InvalidPayloadError("Payload da OS inválido ou vazio");
    }
    const p = payload as Record<string, unknown>;
    const workOrderId = p.workOrderId;
    if (workOrderId == null || typeof workOrderId !== "number") {
      throw new InvalidPayloadError(
        "Payload da OS deve conter workOrderId (number)",
      );
    }
  }

  async handle(payload: any): Promise<void> {
    this.validatePayload(payload);

    this.logger.log(
      `Recebendo OS ${payload.workOrderId} para processar na produção`,
    );

    try {
      await this.productionQueueService.addWorkOrderToQueue(
        payload.workOrderId,
        {
          customerId: payload.customerId,
          vehicleId: payload.vehicleId,
          protocol: payload.protocol,
          totalAmount: payload.totalAmount,
        },
      );
      this.logger.log(
        `OS ${payload.workOrderId} adicionada à fila de produção com sucesso`,
      );
    } catch (error: unknown) {
      this.logger.error("Erro ao adicionar OS à fila de produção", {
        error: error instanceof Error ? error.message : String(error),
        workOrderId: payload.workOrderId,
      });
      throw error;
    }
  }
}
