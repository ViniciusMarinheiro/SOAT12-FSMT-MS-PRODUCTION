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
exports.GetProductionQueueUseCase = void 0;
const common_1 = require("@nestjs/common");
const production_queue_service_1 = require("../services/production-queue.service");
let GetProductionQueueUseCase = class GetProductionQueueUseCase {
    productionQueueService;
    constructor(productionQueueService) {
        this.productionQueueService = productionQueueService;
    }
    async execute() {
        return this.productionQueueService.getQueueStatus();
    }
};
exports.GetProductionQueueUseCase = GetProductionQueueUseCase;
exports.GetProductionQueueUseCase = GetProductionQueueUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [production_queue_service_1.ProductionQueueService])
], GetProductionQueueUseCase);
//# sourceMappingURL=get-production-queue.use-case.js.map