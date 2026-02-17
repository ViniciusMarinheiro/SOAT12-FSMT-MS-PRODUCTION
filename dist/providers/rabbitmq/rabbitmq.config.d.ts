import { MessageConfig } from "./types/message.interface";
export interface RabbitMQConfig extends MessageConfig {
    exchangeType?: "topic" | "direct" | "fanout" | "headers" | "x-message-deduplication";
    strategyKey?: string;
    exchangeArguments?: Record<string, number | string | boolean>;
    isConsumer?: boolean;
}
export declare const rabbitMQConfig: Record<string, RabbitMQConfig>;
export declare const getRabbitMQConfigs: () => RabbitMQConfig[];
export declare const getConsumerConfigs: () => RabbitMQConfig[];
