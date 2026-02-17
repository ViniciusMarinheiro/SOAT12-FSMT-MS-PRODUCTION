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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleMessageStrategyFactory = void 0;
const common_1 = require("@nestjs/common");
const receiveWorkOrderStrategy_service_1 = require("./receiveWorkOrderStrategy.service");
const rabbitmq_config_1 = require("../rabbitmq.config");
let HandleMessageStrategyFactory = class HandleMessageStrategyFactory {
    receiveWorkOrderStrategy;
    strategies = new Map();
    strategyMap = {};
    constructor(receiveWorkOrderStrategy) {
        this.receiveWorkOrderStrategy = receiveWorkOrderStrategy;
        this.strategyMap = {
            receiveWorkOrder: this.receiveWorkOrderStrategy,
        };
        Object.values(rabbitmq_config_1.rabbitMQConfig).forEach((config) => {
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
    getStrategy(queue, routingKey) {
        let strategy = this.strategies.get(queue);
        if (!strategy) {
            strategy = this.strategies.get(routingKey);
        }
        if (!strategy) {
            throw new Error(`No strategy found for queue: ${queue} or routing key: ${routingKey}`);
        }
        return strategy;
    }
};
exports.HandleMessageStrategyFactory = HandleMessageStrategyFactory;
exports.HandleMessageStrategyFactory = HandleMessageStrategyFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [receiveWorkOrderStrategy_service_1.ReceiveWorkOrderStrategy])
], HandleMessageStrategyFactory);
//# sourceMappingURL=handleMessageStrategy.service.js.map