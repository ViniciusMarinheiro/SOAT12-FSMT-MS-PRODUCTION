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
var ReceiveWorkOrderStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveWorkOrderStrategy = void 0;
const common_1 = require("@nestjs/common");
const production_queue_service_1 = require("../../../modules/production/application/services/production-queue.service");
const invalidPayloadError_1 = require("../../../common/exceptions/invalidPayloadError");
let ReceiveWorkOrderStrategy = ReceiveWorkOrderStrategy_1 = class ReceiveWorkOrderStrategy {
    productionQueueService;
    logger = new common_1.Logger(ReceiveWorkOrderStrategy_1.name);
    constructor(productionQueueService) {
        this.productionQueueService = productionQueueService;
    }
    validatePayload(payload) {
        if (!payload || typeof payload !== "object") {
            throw new invalidPayloadError_1.InvalidPayloadError("Payload da OS inválido ou vazio");
        }
        const p = payload;
        const workOrderId = p.workOrderId;
        if (workOrderId == null || typeof workOrderId !== "number") {
            throw new invalidPayloadError_1.InvalidPayloadError("Payload da OS deve conter workOrderId (number)");
        }
    }
    async handle(payload) {
        this.validatePayload(payload);
        this.logger.log(`Recebendo OS ${payload.workOrderId} para processar na produção`);
        try {
            await this.productionQueueService.addWorkOrderToQueue(payload.workOrderId, {
                customerId: payload.customerId,
                vehicleId: payload.vehicleId,
                protocol: payload.protocol,
                totalAmount: payload.totalAmount,
            });
            this.logger.log(`OS ${payload.workOrderId} adicionada à fila de produção com sucesso`);
        }
        catch (error) {
            this.logger.error("Erro ao adicionar OS à fila de produção", {
                error: error instanceof Error ? error.message : String(error),
                workOrderId: payload.workOrderId,
            });
            throw error;
        }
    }
};
exports.ReceiveWorkOrderStrategy = ReceiveWorkOrderStrategy;
exports.ReceiveWorkOrderStrategy = ReceiveWorkOrderStrategy = ReceiveWorkOrderStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [production_queue_service_1.ProductionQueueService])
], ReceiveWorkOrderStrategy);
//# sourceMappingURL=receiveWorkOrderStrategy.service.js.map