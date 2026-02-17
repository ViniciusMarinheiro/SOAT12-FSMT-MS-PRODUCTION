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
var FinishProductionUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinishProductionUseCase = void 0;
const common_1 = require("@nestjs/common");
const update_production_status_use_case_1 = require("./update-production-status.use-case");
const production_status_enum_1 = require("../../domain/enums/production-status.enum");
let FinishProductionUseCase = FinishProductionUseCase_1 = class FinishProductionUseCase {
    updateProductionStatusUseCase;
    logger = new common_1.Logger(FinishProductionUseCase_1.name);
    constructor(updateProductionStatusUseCase) {
        this.updateProductionStatusUseCase = updateProductionStatusUseCase;
    }
    async execute(workOrderId) {
        this.logger.log(`Finalizando produção da OS ${workOrderId}`);
        await this.updateProductionStatusUseCase.execute(workOrderId, production_status_enum_1.ProductionStatusEnum.COMPLETED);
        this.logger.log(`Produção da OS ${workOrderId} finalizada`);
        return { workOrderId, status: "COMPLETED" };
    }
};
exports.FinishProductionUseCase = FinishProductionUseCase;
exports.FinishProductionUseCase = FinishProductionUseCase = FinishProductionUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [update_production_status_use_case_1.UpdateProductionStatusUseCase])
], FinishProductionUseCase);
//# sourceMappingURL=finish-production.use-case.js.map