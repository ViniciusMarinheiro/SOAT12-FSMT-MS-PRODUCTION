"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RabbitMQSetupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQSetupService = void 0;
const common_1 = require("@nestjs/common");
const amqp = require("amqplib");
const rabbitmq_config_1 = require("./rabbitmq.config");
const env_config_service_1 = require("../../common/service/env/env-config.service");
let RabbitMQSetupService = RabbitMQSetupService_1 = class RabbitMQSetupService {
    envConfigService;
    logger = new common_1.Logger(RabbitMQSetupService_1.name);
    constructor(envConfigService) {
        this.envConfigService = envConfigService;
    }
    async createExchangesAndQueues(rabbitmqUrl) {
        let connectionModel = null;
        let channel = null;
        try {
            connectionModel = await amqp.connect(rabbitmqUrl);
            if (!connectionModel) {
                throw new Error("Falha ao conectar ao RabbitMQ");
            }
            channel = await connectionModel.createChannel();
            if (!channel) {
                throw new Error("Falha ao criar channel do RabbitMQ");
            }
            const activeChannel = channel;
            for (const config of (0, rabbitmq_config_1.getRabbitMQConfigs)()) {
                if (config.exchange) {
                    await this.createExchangeAndQueue(activeChannel, config);
                }
                else {
                    await this.createQueue(activeChannel, config);
                }
            }
        }
        finally {
            if (channel) {
                try {
                    await channel.close();
                }
                catch (error) {
                    this.logger.warn("Erro ao fechar channel", error);
                }
            }
            if (connectionModel) {
                try {
                    await connectionModel.close();
                }
                catch (error) {
                    this.logger.warn("Erro ao fechar connection", error);
                }
            }
        }
    }
    async createExchangeAndQueue(channel, config) {
        if (!config.exchange) {
            throw new Error("Exchange é obrigatório");
        }
        const dlqExchange = config.deadLetterExchange ?? `${config.exchange}.dlq`;
        const dlqQueue = `${config.queue}.dlq`;
        const dlqRoutingKey = config.deadLetterRoutingKey ?? "send-to-production.dlq";
        await channel.assertExchange(dlqExchange, "direct", {
            durable: true,
            autoDelete: true,
        });
        await channel.assertQueue(dlqQueue, { durable: true });
        await channel.bindQueue(dlqQueue, dlqExchange, dlqRoutingKey);
        await channel.assertExchange(config.exchange, config.exchangeType || "topic", {
            durable: true,
            autoDelete: true,
            ...(config.exchangeArguments && {
                arguments: config.exchangeArguments,
            }),
        });
        await channel.assertQueue(config.queue, {
            durable: true,
            arguments: {
                ...(config.exchangeArguments?.["x-cache-size"] != null && {
                    "x-cache-size": config.exchangeArguments["x-cache-size"],
                }),
                "x-dead-letter-exchange": config.deadLetterExchange || "DLX",
                "x-dead-letter-routing-key": config.deadLetterRoutingKey || config.queue,
            },
        });
        await channel.bindQueue(config.queue, config.exchange, config.routingKey);
        this.logger.log(`Exchange e fila criadas: ${config.exchange} e ${config.queue}`);
    }
    async createQueue(channel, config) {
        await channel.assertQueue(config.queue, {
            durable: true,
            arguments: {
                "x-dead-letter-exchange": config.deadLetterExchange || "DLX",
                "x-dead-letter-routing-key": config.deadLetterRoutingKey || config.queue,
            },
        });
        this.logger.log(`Fila criada: ${config.queue}`);
    }
};
exports.RabbitMQSetupService = RabbitMQSetupService;
exports.RabbitMQSetupService = RabbitMQSetupService = RabbitMQSetupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [env_config_service_1.EnvConfigService])
], RabbitMQSetupService);
//# sourceMappingURL=rabbitmq.setup.service.js.map