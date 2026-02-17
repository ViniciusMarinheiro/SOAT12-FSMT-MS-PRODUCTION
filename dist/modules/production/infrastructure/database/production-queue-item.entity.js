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
exports.ProductionQueueItem = void 0;
const typeorm_1 = require("typeorm");
const production_status_enum_1 = require("../../domain/enums/production-status.enum");
let ProductionQueueItem = class ProductionQueueItem {
    id;
    workOrderId;
    customerId;
    vehicleId;
    protocol;
    totalAmount;
    status;
    createdAt;
    updatedAt;
    startedAt;
    completedAt;
};
exports.ProductionQueueItem = ProductionQueueItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductionQueueItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", name: "work_order_id", unique: true }),
    __metadata("design:type", Number)
], ProductionQueueItem.prototype, "workOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", name: "customer_id", nullable: true }),
    __metadata("design:type", Object)
], ProductionQueueItem.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", name: "vehicle_id", nullable: true }),
    __metadata("design:type", Object)
], ProductionQueueItem.prototype, "vehicleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", name: "protocol", nullable: true }),
    __metadata("design:type", Object)
], ProductionQueueItem.prototype, "protocol", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "decimal",
        precision: 12,
        scale: 2,
        name: "total_amount",
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductionQueueItem.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: production_status_enum_1.ProductionStatusEnum,
        enumName: "production_queue_status_enum",
        default: production_status_enum_1.ProductionStatusEnum.QUEUED,
    }),
    __metadata("design:type", String)
], ProductionQueueItem.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], ProductionQueueItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], ProductionQueueItem.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "timestamp with time zone",
        name: "started_at",
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductionQueueItem.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "timestamp with time zone",
        name: "completed_at",
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductionQueueItem.prototype, "completedAt", void 0);
exports.ProductionQueueItem = ProductionQueueItem = __decorate([
    (0, typeorm_1.Entity)("production_queue_items")
], ProductionQueueItem);
//# sourceMappingURL=production-queue-item.entity.js.map