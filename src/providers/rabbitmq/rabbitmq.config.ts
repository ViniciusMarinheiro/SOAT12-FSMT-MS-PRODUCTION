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
  // Fila para enviar atualizações de status para MS-ORDER (só publica, não consome)
  sendStatusUpdate: {
    exchange: "production.v1",
    queue: "production.v1.status-update",
    routingKey: "status-update",
    deadLetterExchange: "production.v1.dlq",
    deadLetterRoutingKey: "status-update.dlq",
    strategyKey: "sendStatusUpdate",
    isConsumer: false,
  },
};

export const getRabbitMQConfigs = (): RabbitMQConfig[] => {
  return Object.values(rabbitMQConfig);
};

/** Retorna apenas configs em que este serviço é consumer (para connectMicroservices). */
export const getConsumerConfigs = (): RabbitMQConfig[] => {
  return getRabbitMQConfigs().filter((c) => c.isConsumer !== false);
};
