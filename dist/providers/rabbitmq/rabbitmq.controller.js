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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RabbitMQController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const handleMessageStrategy_service_1 = require("./strategy/handleMessageStrategy.service");
const rabbitmq_config_1 = require("./rabbitmq.config");
const env_config_service_1 = require("../../common/service/env/env-config.service");
const invalidPayloadError_1 = require("../../common/exceptions/invalidPayloadError");
let RabbitMQController = RabbitMQController_1 = class RabbitMQController {
    strategyFactory;
    envConfigService;
    logger = new common_1.Logger(RabbitMQController_1.name);
    maxRetries;
    retryDelayMs;
    dlqRepublishToMain;
    constructor(strategyFactory, envConfigService) {
        this.strategyFactory = strategyFactory;
        this.envConfigService = envConfigService;
        this.maxRetries =
            this.envConfigService.get("RABBITMQ_CONSUMER_MAX_RETRIES") || 3;
        this.retryDelayMs =
            this.envConfigService.get("RABBITMQ_CONSUMER_RETRY_DELAY_MS") || 1000;
        this.dlqRepublishToMain =
            this.envConfigService.get("DLQ_REPUBLISH_TO_MAIN") || false;
    }
    async handleMessage(data, context) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        const routingKey = originalMessage.fields.routingKey;
        const consumerTag = originalMessage.fields.consumerTag;
        const queue = consumerTag.replace(/_consumer$/, "");
        if (queue.endsWith(".dlq")) {
            await this.handleDlqMessage(data, channel, originalMessage, queue);
            return;
        }
        this.logger.debug(`Processando mensagem - Queue: ${queue}, Routing Key: ${routingKey}`);
        const strategy = this.strategyFactory.getStrategy(queue, routingKey);
        let lastError = null;
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                await strategy.handle(data);
                try {
                    channel.ack(originalMessage);
                }
                catch (ackError) {
                    this.logger.warn("Erro ao fazer ACK da mensagem", {
                        error: ackError.message,
                        routingKey,
                    });
                }
                return;
            }
            catch (error) {
                if (error instanceof invalidPayloadError_1.InvalidPayloadError) {
                    this.logger.debug("Payload inválido - enviando para DLQ sem retry", {
                        queue,
                        routingKey,
                    });
                    try {
                        channel.nack(originalMessage, false, false);
                    }
                    catch (nackError) {
                        this.logger.debug("Erro ao fazer NACK da mensagem", {
                            error: nackError.message,
                        });
                    }
                    return;
                }
                lastError = error;
                this.logger.debug(`Tentativa ${attempt}/${this.maxRetries} falhou - ${error?.message}`, { queue, routingKey, attempt });
                if (attempt < this.maxRetries) {
                    await this.sleep(this.retryDelayMs);
                }
            }
        }
        this.logger.error(`Mensagem enviada para DLQ após ${this.maxRetries} tentativas`, { queue, routingKey, error: lastError?.message });
        try {
            channel.nack(originalMessage, false, false);
        }
        catch (nackError) {
            this.logger.warn("Erro ao fazer NACK da mensagem", {
                error: nackError.message,
            });
        }
    }
    async handleDlqMessage(data, channel, originalMessage, dlqQueue) {
        const mainQueue = dlqQueue.replace(/\.dlq$/, "");
        const config = (0, rabbitmq_config_1.getRabbitMQConfigs)().find((c) => c.queue === mainQueue);
        this.logger.debug(`Mensagem recebida na DLQ: ${dlqQueue}`, {
            payload: data,
            mainQueue,
        });
        if (this.dlqRepublishToMain && config?.exchange && config?.routingKey) {
            try {
                channel.publish(config.exchange, config.routingKey, Buffer.from(JSON.stringify(data)), { persistent: true });
                this.logger.log(`Mensagem republicada na fila principal: ${mainQueue}`);
            }
            catch (err) {
                this.logger.error("Falha ao republicar mensagem da DLQ", {
                    error: err?.message,
                    mainQueue,
                });
            }
        }
        try {
            channel.ack(originalMessage);
        }
        catch (ackError) {
            this.logger.warn("Erro ao fazer ACK da mensagem na DLQ", {
                error: ackError.message,
            });
        }
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.RabbitMQController = RabbitMQController;
__decorate([
    (0, microservices_1.EventPattern)("send-to-production"),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.RmqContext]),
    __metadata("design:returntype", Promise)
], RabbitMQController.prototype, "handleMessage", null);
exports.RabbitMQController = RabbitMQController = RabbitMQController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [handleMessageStrategy_service_1.HandleMessageStrategyFactory,
        env_config_service_1.EnvConfigService])
], RabbitMQController);
//# sourceMappingURL=rabbitmq.controller.js.map