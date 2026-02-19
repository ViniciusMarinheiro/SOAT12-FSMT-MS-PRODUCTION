import { Module, forwardRef } from "@nestjs/common";
import { EnvConfigModule } from "@/common/service/env/env-config.module";
import { RabbitMQController } from "./rabbitmq.controller";
import { RabbitMQService } from "./rabbitmq.service";
import { RabbitMQSetupService } from "./rabbitmq.setup.service";
import { HandleMessageStrategyFactory } from "./strategy/handleMessageStrategy.service";
import { ReceiveWorkOrderStrategy } from "./strategy/receiveWorkOrderStrategy.service";
import { getRabbitMQConfigs } from "./rabbitmq.config";
import { ProductionStatusQueueProvider } from "./providers/production-status-queue.provider";
import { ProductionQueueService } from "@/modules/production/application/services/production-queue.service";
import { ProductionModule } from "@/modules/production/production.module";

@Module({
  imports: [
    EnvConfigModule,
    forwardRef(() => ProductionModule),
    ...getRabbitMQConfigs().map((config) =>
      RabbitMQService.registerClient(config),
    ),
  ],
  controllers: [RabbitMQController],
  providers: [
    RabbitMQService,
    RabbitMQSetupService,
    ReceiveWorkOrderStrategy,
    HandleMessageStrategyFactory,
    ProductionStatusQueueProvider,
  ],
  exports: [
    RabbitMQSetupService,
    RabbitMQService,
    ProductionStatusQueueProvider,
  ],
})
export class RabbitMQModule {}
