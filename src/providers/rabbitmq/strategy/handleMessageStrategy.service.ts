import { Injectable } from "@nestjs/common";
import { MessageHandler } from "../types/message.interface";
import { ReceiveWorkOrderStrategy } from "./receiveWorkOrderStrategy.service";
import { SagaCompensateProductionStrategy } from "./sagaCompensateProductionStrategy.service";
import { rabbitMQConfig } from "../rabbitmq.config";

@Injectable()
export class HandleMessageStrategyFactory {
  private strategies = new Map<string, MessageHandler>();

  private strategyMap: Record<string, MessageHandler> = {};

  constructor(
    private receiveWorkOrderStrategy: ReceiveWorkOrderStrategy,
    private sagaCompensateProductionStrategy: SagaCompensateProductionStrategy,
  ) {
    this.strategyMap = {
      receiveWorkOrder: this.receiveWorkOrderStrategy,
      sagaCompensateProduction: this.sagaCompensateProductionStrategy,
    };

    Object.values(rabbitMQConfig).forEach((config) => {
      if (config.strategyKey) {
        const strategy = this.strategyMap[config.strategyKey];
        if (strategy) {
          this.strategies.set(config.queue, strategy);
          this.strategies.set(config.routingKey, strategy);
          if (config.exchange) {
            this.strategies.set(config.exchange, strategy);
          }
        }
      }
    });
  }

  getStrategy(queue: string, routingKey: string): MessageHandler {
    let strategy = this.strategies.get(queue);

    if (!strategy) {
      strategy = this.strategies.get(routingKey);
    }

    if (!strategy) {
      throw new Error(
        `No strategy found for queue: ${queue} or routing key: ${routingKey}`,
      );
    }

    return strategy;
  }
}
