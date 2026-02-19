import { Injectable, Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { rabbitMQConfig } from "../rabbitmq.config";

export interface SendStatusUpdatePayload {
  workOrderId: number;
  status: string; // WorkOrderStatusEnum como string
  startedAt?: Date;
  finishedAt?: Date;
}

@Injectable()
export class ProductionStatusQueueProvider {
  private readonly logger = new Logger(ProductionStatusQueueProvider.name);

  constructor(
    @Inject(rabbitMQConfig.sendStatusUpdate.routingKey)
    private readonly client: ClientProxy,
  ) {}

  async sendStatusUpdate(payload: SendStatusUpdatePayload): Promise<void> {
    this.logger.log(
      `Enviando atualização de status da OS ${payload.workOrderId} para MS-ORDER`,
    );

    const serialized = {
      workOrderId: payload.workOrderId,
      status: payload.status,
      startedAt:
        payload.startedAt instanceof Date
          ? payload.startedAt.toISOString()
          : payload.startedAt,
      finishedAt:
        payload.finishedAt instanceof Date
          ? payload.finishedAt.toISOString()
          : payload.finishedAt,
    };

    const config = rabbitMQConfig.sendStatusUpdate;
    await firstValueFrom(this.client.emit(config.routingKey, serialized));

    this.logger.log(
      `Atualização de status da OS ${payload.workOrderId} enviada com sucesso`,
    );
  }
}
