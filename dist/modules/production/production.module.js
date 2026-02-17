"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const production_controller_1 = require("./infrastructure/web/production.controller");
const production_queue_service_1 = require("./application/services/production-queue.service");
const update_production_status_use_case_1 = require("./application/use-cases/update-production-status.use-case");
const get_production_queue_use_case_1 = require("./application/use-cases/get-production-queue.use-case");
const finish_production_use_case_1 = require("./application/use-cases/finish-production.use-case");
const production_queue_item_entity_1 = require("./infrastructure/database/production-queue-item.entity");
const env_config_module_1 = require("../../common/service/env/env-config.module");
const rabbitmq_module_1 = require("../../providers/rabbitmq/rabbitmq.module");
let ProductionModule = class ProductionModule {
};
exports.ProductionModule = ProductionModule;
exports.ProductionModule = ProductionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            env_config_module_1.EnvConfigModule,
            typeorm_1.TypeOrmModule.forFeature([production_queue_item_entity_1.ProductionQueueItem]),
            (0, common_1.forwardRef)(() => rabbitmq_module_1.RabbitMQModule),
        ],
        exports: [production_queue_service_1.ProductionQueueService],
        controllers: [production_controller_1.ProductionController],
        providers: [
            production_queue_service_1.ProductionQueueService,
            update_production_status_use_case_1.UpdateProductionStatusUseCase,
            get_production_queue_use_case_1.GetProductionQueueUseCase,
            finish_production_use_case_1.FinishProductionUseCase,
        ],
    })
], ProductionModule);
//# sourceMappingURL=production.module.js.map