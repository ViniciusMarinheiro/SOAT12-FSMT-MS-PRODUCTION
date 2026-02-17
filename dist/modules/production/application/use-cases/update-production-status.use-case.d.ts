import { ProductionStatusEnum } from "../../domain/enums/production-status.enum";
import { ProductionStatusQueueProvider } from "@/providers/rabbitmq/providers/production-status-queue.provider";
import { ProductionQueueService } from "../services/production-queue.service";
export declare class UpdateProductionStatusUseCase {
    private readonly productionStatusQueueProvider;
    private readonly productionQueueService;
    private readonly logger;
    constructor(productionStatusQueueProvider: ProductionStatusQueueProvider, productionQueueService: ProductionQueueService);
    execute(workOrderId: number, status: ProductionStatusEnum): Promise<{
        workOrderId: number;
        status: ProductionStatusEnum;
        message: string;
    }>;
    private mapProductionStatusToWorkOrderStatus;
}
