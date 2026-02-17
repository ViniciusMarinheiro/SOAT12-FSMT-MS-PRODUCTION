"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQModule = void 0;
const common_1 = require("@nestjs/common");
const env_config_module_1 = require("../../common/service/env/env-config.module");
const rabbitmq_controller_1 = require("./rabbitmq.controller");
const rabbitmq_service_1 = require("./rabbitmq.service");
const rabbitmq_setup_service_1 = require("./rabbitmq.setup.service");
const handleMessageStrategy_service_1 = require("./strategy/handleMessageStrategy.service");
const receiveWorkOrderStrategy_service_1 = require("./strategy/receiveWorkOrderStrategy.service");
const rabbitmq_config_1 = require("./rabbitmq.config");
const production_status_queue_provider_1 = require("./providers/production-status-queue.provider");
const production_module_1 = require("../../modules/production/production.module");
let RabbitMQModule = class RabbitMQModule {
};
exports.RabbitMQModule = RabbitMQModule;
exports.RabbitMQModule = RabbitMQModule = __decorate([
    (0, common_1.Module)({
        imports: [
            env_config_module_1.EnvConfigModule,
            (0, common_1.forwardRef)(() => production_module_1.ProductionModule),
            ...(0, rabbitmq_config_1.getRabbitMQConfigs)().map((config) => rabbitmq_service_1.RabbitMQService.registerClient(config)),
        ],
        controllers: [rabbitmq_controller_1.RabbitMQController],
        providers: [
            rabbitmq_service_1.RabbitMQService,
            rabbitmq_setup_service_1.RabbitMQSetupService,
            receiveWorkOrderStrategy_service_1.ReceiveWorkOrderStrategy,
            handleMessageStrategy_service_1.HandleMessageStrategyFactory,
            production_status_queue_provider_1.ProductionStatusQueueProvider,
        ],
        exports: [
            rabbitmq_setup_service_1.RabbitMQSetupService,
            rabbitmq_service_1.RabbitMQService,
            production_status_queue_provider_1.ProductionStatusQueueProvider,
        ],
    })
], RabbitMQModule);
//# sourceMappingURL=rabbitmq.module.js.map