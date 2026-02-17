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
var ProductionStatusQueueProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionStatusQueueProvider = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const rabbitmq_config_1 = require("../rabbitmq.config");
let ProductionStatusQueueProvider = ProductionStatusQueueProvider_1 = class ProductionStatusQueueProvider {
    client;
    logger = new common_1.Logger(ProductionStatusQueueProvider_1.name);
    constructor(client) {
        this.client = client;
    }
    async sendStatusUpdate(payload) {
        this.logger.log(`Enviando atualização de status da OS ${payload.workOrderId} para MS-ORDER`);
        const serialized = {
            workOrderId: payload.workOrderId,
            status: payload.status,
            startedAt: payload.startedAt instanceof Date
                ? payload.startedAt.toISOString()
                : payload.startedAt,
            finishedAt: payload.finishedAt instanceof Date
                ? payload.finishedAt.toISOString()
                : payload.finishedAt,
        };
        const config = rabbitmq_config_1.rabbitMQConfig.sendStatusUpdate;
        await (0, rxjs_1.firstValueFrom)(this.client.emit(config.routingKey, serialized));
        this.logger.log(`Atualização de status da OS ${payload.workOrderId} enviada com sucesso`);
    }
};
exports.ProductionStatusQueueProvider = ProductionStatusQueueProvider;
exports.ProductionStatusQueueProvider = ProductionStatusQueueProvider = ProductionStatusQueueProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(rabbitmq_config_1.rabbitMQConfig.sendStatusUpdate.routingKey)),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], ProductionStatusQueueProvider);
//# sourceMappingURL=production-status-queue.provider.js.map