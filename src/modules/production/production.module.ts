import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductionController } from "./infrastructure/web/production.controller";
import { ProductionQueueService } from "./application/services/production-queue.service";
import { UpdateProductionStatusUseCase } from "./application/use-cases/update-production-status.use-case";
import { GetProductionQueueUseCase } from "./application/use-cases/get-production-queue.use-case";
import { FinishProductionUseCase } from "./application/use-cases/finish-production.use-case";
import { ProductionQueueItem } from "./infrastructure/database/production-queue-item.entity";
import { EnvConfigModule } from "../../common/service/env/env-config.module";
import { RabbitMQModule } from "@/providers/rabbitmq/rabbitmq.module";

@Module({
  imports: [
    EnvConfigModule,
    TypeOrmModule.forFeature([ProductionQueueItem]),
    forwardRef(() => RabbitMQModule),
  ],
  exports: [ProductionQueueService],
  controllers: [ProductionController],
  providers: [
    ProductionQueueService,
    UpdateProductionStatusUseCase,
    GetProductionQueueUseCase,
    FinishProductionUseCase,
  ],
})
export class ProductionModule {}
