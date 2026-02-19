import { Injectable, Logger } from "@nestjs/common";
import { MessageHandler } from "../types/message.interface";
import { ProductionQueueService } from "@/modules/production/application/services/production-queue.service";
import {
  SagaCompensatePayload,
  SAGA_STEP_SEND_TO_PRODUCTION,
} from "../saga/saga.types";

@Injectable()
export class SagaCompensateProductionStrategy implements MessageHandler<SagaCompensatePayload> {
  private readonly logger = new Logger(SagaCompensateProductionStrategy.name);

  constructor(
    private readonly productionQueueService: ProductionQueueService,
  ) {}

  async handle(rawPayload: unknown): Promise<void> {
    const payload = this.normalizePayload(rawPayload);
    if (payload.step !== SAGA_STEP_SEND_TO_PRODUCTION) {
      this.logger.debug(
        `Saga compensate ignorado (step=${payload.step}, esperado ${SAGA_STEP_SEND_TO_PRODUCTION})`,
      );
      return;
    }

    this.logger.log(
      `Saga compensate: removendo OS ${payload.workOrderId} da fila de produção`,
    );
    const removed =
      await this.productionQueueService.removeFromQueueByWorkOrderId(
        payload.workOrderId,
      );
    if (!removed) {
      this.logger.warn(
        `OS ${payload.workOrderId} não estava na fila ou já foi removida`,
      );
    }
  }

  private normalizePayload(raw: unknown): SagaCompensatePayload {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!data?.workOrderId || !data?.step) {
      throw new Error("Payload inválido: workOrderId e step obrigatórios");
    }
    return {
      sagaId: data.sagaId,
      workOrderId: Number(data.workOrderId),
      step: data.step,
      timestamp: data.timestamp,
      reason: data.reason,
      failedStep: data.failedStep,
    };
  }
}
