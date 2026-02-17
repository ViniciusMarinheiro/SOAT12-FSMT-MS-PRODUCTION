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
var ProductionQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionQueueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const production_status_enum_1 = require("../../domain/enums/production-status.enum");
const production_queue_item_entity_1 = require("../../infrastructure/database/production-queue-item.entity");
let ProductionQueueService = ProductionQueueService_1 = class ProductionQueueService {
    repo;
    logger = new common_1.Logger(ProductionQueueService_1.name);
    constructor(repo) {
        this.repo = repo;
    }
    async addWorkOrderToQueue(workOrderId, extra) {
        const existing = await this.repo.findOne({
            where: { workOrderId, status: production_status_enum_1.ProductionStatusEnum.QUEUED },
        });
        if (existing) {
            this.logger.debug(`OS ${workOrderId} já está na fila (ignorando duplicata)`);
            return existing;
        }
        const alreadyProcessed = await this.repo.findOne({
            where: { workOrderId },
        });
        if (alreadyProcessed) {
            this.logger.log(`OS ${workOrderId} já existia; reenfileirando com status QUEUED`);
            alreadyProcessed.status = production_status_enum_1.ProductionStatusEnum.QUEUED;
            alreadyProcessed.customerId =
                extra?.customerId ?? alreadyProcessed.customerId;
            alreadyProcessed.vehicleId =
                extra?.vehicleId ?? alreadyProcessed.vehicleId;
            alreadyProcessed.protocol = extra?.protocol ?? alreadyProcessed.protocol;
            alreadyProcessed.totalAmount =
                extra?.totalAmount ?? alreadyProcessed.totalAmount;
            alreadyProcessed.startedAt = null;
            alreadyProcessed.completedAt = null;
            return this.repo.save(alreadyProcessed);
        }
        this.logger.log(`Adicionando OS ${workOrderId} à fila de produção`);
        return this.repo.save({
            workOrderId,
            customerId: extra?.customerId ?? null,
            vehicleId: extra?.vehicleId ?? null,
            protocol: extra?.protocol ?? null,
            totalAmount: extra?.totalAmount ?? null,
            status: production_status_enum_1.ProductionStatusEnum.QUEUED,
        });
    }
    async updateItemStatus(workOrderId, status) {
        let item = await this.repo.findOne({ where: { workOrderId } });
        if (!item) {
            this.logger.log(`OS ${workOrderId} não estava na fila; criando registro com status ${status}`);
            item = this.repo.create({
                workOrderId,
                status,
                startedAt: status === production_status_enum_1.ProductionStatusEnum.IN_DIAGNOSIS ||
                    status === production_status_enum_1.ProductionStatusEnum.IN_REPAIR ||
                    status === production_status_enum_1.ProductionStatusEnum.COMPLETED
                    ? new Date()
                    : null,
                completedAt: status === production_status_enum_1.ProductionStatusEnum.COMPLETED ? new Date() : null,
            });
        }
        else {
            item.status = status;
            if (status === production_status_enum_1.ProductionStatusEnum.IN_DIAGNOSIS && !item.startedAt) {
                item.startedAt = new Date();
            }
            if (status === production_status_enum_1.ProductionStatusEnum.COMPLETED) {
                item.completedAt = new Date();
            }
        }
        await this.repo.save(item);
        this.logger.debug(`Status da OS ${workOrderId} atualizado para ${status}`);
    }
    async getQueueStatus() {
        const items = await this.repo.find({
            order: { createdAt: "ASC" },
        });
        const waiting = items.filter((i) => i.status === production_status_enum_1.ProductionStatusEnum.QUEUED);
        const inDiagnosis = items.filter((i) => i.status === production_status_enum_1.ProductionStatusEnum.IN_DIAGNOSIS);
        const inRepair = items.filter((i) => i.status === production_status_enum_1.ProductionStatusEnum.IN_REPAIR);
        const completed = items.filter((i) => i.status === production_status_enum_1.ProductionStatusEnum.COMPLETED);
        const mapItem = (item) => ({
            workOrderId: item.workOrderId,
            status: item.status,
            createdAt: item.createdAt,
            protocol: item.protocol,
        });
        return {
            waiting: waiting.length,
            inDiagnosis: inDiagnosis.length,
            inRepair: inRepair.length,
            completed: completed.length,
            jobs: {
                waiting: waiting.map(mapItem),
                inDiagnosis: inDiagnosis.map(mapItem),
                inRepair: inRepair.map(mapItem),
                completed: completed.map(mapItem),
            },
        };
    }
};
exports.ProductionQueueService = ProductionQueueService;
exports.ProductionQueueService = ProductionQueueService = ProductionQueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(production_queue_item_entity_1.ProductionQueueItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductionQueueService);
//# sourceMappingURL=production-queue.service.js.map