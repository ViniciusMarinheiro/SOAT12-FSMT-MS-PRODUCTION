"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConsumerConfigs = exports.getRabbitMQConfigs = exports.rabbitMQConfig = void 0;
exports.rabbitMQConfig = {
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
};
const getRabbitMQConfigs = () => {
    return Object.values(exports.rabbitMQConfig);
};
exports.getRabbitMQConfigs = getRabbitMQConfigs;
const getConsumerConfigs = () => {
    return (0, exports.getRabbitMQConfigs)().filter((c) => c.isConsumer !== false);
};
exports.getConsumerConfigs = getConsumerConfigs;
//# sourceMappingURL=rabbitmq.config.js.map