import { MessageConfig } from "./types/message.interface";

export interface RabbitMQConfig extends MessageConfig {
  exchangeType?:
    | "topic"
    | "direct"
    | "fanout"
    | "headers"
    | "x-message-deduplication";
  strategyKey?: string;
  exchangeArguments?: Record<string, number | string | boolean>;
  /** Se true, este serviço consome desta fila. Se false, só publica (não registra consumer). */
  isConsumer?: boolean;
}

export const rabbitMQConfig: Record<string, RabbitMQConfig> = {
  // Fila para receber OS para processar
  receiveWorkOrder: {
    exchange: "workorder.v1",
    queue: "workorder.v1.send-to-production",
    routingKey: "send-to-production",
    deadLetterExchange: "workorder.v1.dlq",
    deadLetterRoutingKey: "send-to-production.dlq",
    strategyKey: "receiveWorkOrder",
    isConsumer: true,
  },
  sendStatusUpdate: {
    exchange: "production.v1",
    queue: "production.v1.status-update",
    routingKey: "status-update",
    deadLetterExchange: "production.v1.dlq",
    deadLetterRoutingKey: "status-update.dlq",
    strategyKey: "sendStatusUpdate",
    isConsumer: false,
  },
  sagaCompensateProduction: {
    exchange: "saga.v1",
    queue: "saga.v1.compensate.production",
    routingKey: "compensate",
    deadLetterExchange: "saga.v1.dlq",
    deadLetterRoutingKey: "compensate.production.dlq",
    strategyKey: "sagaCompensateProduction",
    isConsumer: true,
  },
};

export const getRabbitMQConfigs = (): RabbitMQConfig[] => {
  return Object.values(rabbitMQConfig);
};

export const getConsumerConfigs = (): RabbitMQConfig[] => {
  return getRabbitMQConfigs().filter((c) => c.isConsumer !== false);
};
