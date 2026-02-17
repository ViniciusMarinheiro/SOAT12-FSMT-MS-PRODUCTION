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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_production_status_use_case_1 = require("../../application/use-cases/update-production-status.use-case");
const get_production_queue_use_case_1 = require("../../application/use-cases/get-production-queue.use-case");
const finish_production_use_case_1 = require("../../application/use-cases/finish-production.use-case");
const production_queue_service_1 = require("../../application/services/production-queue.service");
const update_production_status_dto_1 = require("./dto/update-production-status.dto");
let ProductionController = class ProductionController {
    updateProductionStatusUseCase;
    getProductionQueueUseCase;
    finishProductionUseCase;
    productionQueueService;
    constructor(updateProductionStatusUseCase, getProductionQueueUseCase, finishProductionUseCase, productionQueueService) {
        this.updateProductionStatusUseCase = updateProductionStatusUseCase;
        this.getProductionQueueUseCase = getProductionQueueUseCase;
        this.finishProductionUseCase = finishProductionUseCase;
        this.productionQueueService = productionQueueService;
    }
    async addToQueue(workOrderId) {
        const item = await this.productionQueueService.addWorkOrderToQueue(+workOrderId);
        return {
            message: "OS adicionada à fila de produção e salva no banco",
            workOrderId: item.workOrderId,
            status: item.status,
            createdAt: item.createdAt,
        };
    }
    async getQueue() {
        return this.getProductionQueueUseCase.execute();
    }
    async updateStatus(workOrderId, dto) {
        return this.updateProductionStatusUseCase.execute(+workOrderId, dto.status);
    }
    async finish(workOrderId) {
        return this.finishProductionUseCase.execute(+workOrderId);
    }
};
exports.ProductionController = ProductionController;
__decorate([
    (0, common_1.Post)("queue/:workOrderId"),
    (0, swagger_1.ApiOperation)({
        summary: "Adicionar OS à fila de produção",
        description: "Registra a OS na fila de produção (persiste no BD). Usado quando a OS vem pelo RabbitMQ ou para inclusão manual.",
    }),
    __param(0, (0, common_1.Param)("workOrderId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "addToQueue", null);
__decorate([
    (0, common_1.Get)("queue"),
    (0, swagger_1.ApiOperation)({
        summary: "Listar fila de produção",
        description: "Retorna todas as OS na fila com contagem por status (aguardando, diagnóstico, reparo, finalizadas).",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "getQueue", null);
__decorate([
    (0, common_1.Patch)(":workOrderId/status"),
    (0, swagger_1.ApiOperation)({
        summary: "Atualizar etapa da produção (diagnóstico/reparo)",
        description: 'Envie no body: { "status": "IN_DIAGNOSIS" } ou { "status": "IN_REPAIR" }. Altera e persiste no BD local. Para finalizar, use POST .../finish.',
    }),
    __param(0, (0, common_1.Param)("workOrderId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_production_status_dto_1.UpdateProductionStatusDto]),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(":workOrderId/finish"),
    (0, swagger_1.ApiOperation)({
        summary: "Finalizar produção e notificar MS-ORDER",
        description: "Marca a OS como COMPLETED, persiste no BD e envia notificação ao MS-ORDER para atualizar a OS como FINISHED.",
    }),
    __param(0, (0, common_1.Param)("workOrderId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "finish", null);
exports.ProductionController = ProductionController = __decorate([
    (0, swagger_1.ApiTags)("production"),
    (0, common_1.Controller)("production"),
    (0, swagger_1.ApiBearerAuth)("Bearer"),
    __metadata("design:paramtypes", [update_production_status_use_case_1.UpdateProductionStatusUseCase,
        get_production_queue_use_case_1.GetProductionQueueUseCase,
        finish_production_use_case_1.FinishProductionUseCase,
        production_queue_service_1.ProductionQueueService])
], ProductionController);
//# sourceMappingURL=production.controller.js.map