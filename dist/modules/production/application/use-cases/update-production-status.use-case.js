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
var UpdateProductionStatusUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductionStatusUseCase = void 0;
const common_1 = require("@nestjs/common");
const production_status_enum_1 = require("../../domain/enums/production-status.enum");
const production_status_queue_provider_1 = require("../../../../providers/rabbitmq/providers/production-status-queue.provider");
const production_queue_service_1 = require("../services/production-queue.service");
let UpdateProductionStatusUseCase = UpdateProductionStatusUseCase_1 = class UpdateProductionStatusUseCase {
    productionStatusQueueProvider;
    productionQueueService;
    logger = new common_1.Logger(UpdateProductionStatusUseCase_1.name);
    constructor(productionStatusQueueProvider, productionQueueService) {
        this.productionStatusQueueProvider = productionStatusQueueProvider;
        this.productionQueueService = productionQueueService;
    }
    async execute(workOrderId, status) {
        this.logger.log(`Atualizando status da OS ${workOrderId} para ${status}`);
        try {
            await this.productionQueueService.updateItemStatus(workOrderId, status);
            const workOrderStatus = this.mapProductionStatusToWorkOrderStatus(status);
            if (status === production_status_enum_1.ProductionStatusEnum.COMPLETED) {
                const now = new Date();
                await this.productionStatusQueueProvider.sendStatusUpdate({
                    workOrderId,
                    status: workOrderStatus,
                    finishedAt: now,
                });
                this.logger.log(`Status da OS ${workOrderId} finalizado no BD e notificação enviada ao MS-ORDER`);
            }
            else {
                this.logger.log(`Status da OS ${workOrderId} atualizado no BD para ${status} (apenas local)`);
            }
            return {
                workOrderId,
                status: status,
                message: `Status da OS ${workOrderId} atualizado para ${status} no banco.`,
            };
        }
        catch (error) {
            this.logger.error(`Erro ao atualizar status da OS ${workOrderId}`, error);
            throw error;
        }
    }
    mapProductionStatusToWorkOrderStatus(productionStatus) {
        const statusMap = {
            [production_status_enum_1.ProductionStatusEnum.QUEUED]: "RECEIVED",
            [production_status_enum_1.ProductionStatusEnum.IN_DIAGNOSIS]: "DIAGNOSING",
            [production_status_enum_1.ProductionStatusEnum.IN_REPAIR]: "IN_PROGRESS",
            [production_status_enum_1.ProductionStatusEnum.COMPLETED]: "FINISHED",
        };
        return statusMap[productionStatus] || "RECEIVED";
    }
};
exports.UpdateProductionStatusUseCase = UpdateProductionStatusUseCase;
exports.UpdateProductionStatusUseCase = UpdateProductionStatusUseCase = UpdateProductionStatusUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [production_status_queue_provider_1.ProductionStatusQueueProvider,
        production_queue_service_1.ProductionQueueService])
], UpdateProductionStatusUseCase);
//# sourceMappingURL=update-production-status.use-case.js.map