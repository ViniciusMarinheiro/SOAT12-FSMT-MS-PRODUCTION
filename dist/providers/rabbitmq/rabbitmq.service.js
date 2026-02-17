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
var RabbitMQService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const env_config_service_1 = require("../../common/service/env/env-config.service");
const env_config_module_1 = require("../../common/service/env/env-config.module");
const rabbitmq_config_1 = require("./rabbitmq.config");
let RabbitMQService = RabbitMQService_1 = class RabbitMQService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    createClientOptions(config) {
        const url = this.configService.get("RABBITMQ_URL");
        if (!url) {
            throw new Error("RABBITMQ_URL não definido");
        }
        const options = {
            transport: microservices_1.Transport.RMQ,
            options: {
                urls: [url],
                queue: config.queue,
                noAck: true,
                prefetchCount: 1,
                persistent: true,
                consumerTag: `${config.queue}_consumer`,
                queueOptions: {
                    durable: true,
                    arguments: {
                        ...(config.exchangeArguments?.["x-cache-size"] != null && {
                            "x-cache-size": config.exchangeArguments["x-cache-size"],
                        }),
                        "x-dead-letter-exchange": config.deadLetterExchange || "DLX",
                        "x-dead-letter-routing-key": config.deadLetterRoutingKey || config.queue,
                    },
                },
            },
        };
        if (config.exchange)
            options.options.exchange = config.exchange;
        if (config.routingKey)
            options.options.routingKey = config.routingKey;
        return options;
    }
    static registerClient(config) {
        return microservices_1.ClientsModule.registerAsync([
            {
                name: config.routingKey,
                imports: [env_config_module_1.EnvConfigModule],
                inject: [env_config_service_1.EnvConfigService],
                useFactory: (configService) => {
                    const service = new RabbitMQService_1(configService);
                    return service.createClientOptions(config);
                },
            },
        ]);
    }
    static connectMicroservices(app, rabbitmqUrl) {
        (0, rabbitmq_config_1.getConsumerConfigs)().forEach((config) => {
            const options = {
                transport: microservices_1.Transport.RMQ,
                options: {
                    urls: [rabbitmqUrl],
                    queue: config.queue,
                    consumerTag: `${config.queue}_consumer`,
                    routingKey: config.routingKey,
                    noAck: false,
                    prefetchCount: 1,
                    persistent: true,
                    noAssert: true,
                    queueOptions: {
                        durable: true,
                        arguments: {
                            ...(config.exchangeArguments?.["x-cache-size"] != null && {
                                "x-cache-size": config.exchangeArguments["x-cache-size"],
                            }),
                            "x-dead-letter-exchange": config.deadLetterExchange || "DLX",
                            "x-dead-letter-routing-key": config.deadLetterRoutingKey || config.queue,
                        },
                    },
                },
            };
            app.connectMicroservice(options);
        });
    }
    static connectDlqMicroservices(app, rabbitmqUrl) {
        (0, rabbitmq_config_1.getConsumerConfigs)().forEach((config) => {
            const dlqQueue = `${config.queue}.dlq`;
            const options = {
                transport: microservices_1.Transport.RMQ,
                options: {
                    urls: [rabbitmqUrl],
                    queue: dlqQueue,
                    consumerTag: `${dlqQueue}_consumer`,
                    noAck: false,
                    prefetchCount: 1,
                    noAssert: true,
                    queueOptions: { durable: true },
                },
            };
            app.connectMicroservice(options);
        });
    }
};
exports.RabbitMQService = RabbitMQService;
exports.RabbitMQService = RabbitMQService = RabbitMQService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [env_config_service_1.EnvConfigService])
], RabbitMQService);
//# sourceMappingURL=rabbitmq.service.js.map