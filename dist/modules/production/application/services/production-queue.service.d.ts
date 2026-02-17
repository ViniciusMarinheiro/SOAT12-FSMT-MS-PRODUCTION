import { Repository } from "typeorm";
import { ProductionStatusEnum } from "../../domain/enums/production-status.enum";
import { ProductionQueueItem } from "../../infrastructure/database/production-queue-item.entity";
export declare class ProductionQueueService {
    private readonly repo;
    private readonly logger;
    constructor(repo: Repository<ProductionQueueItem>);
    addWorkOrderToQueue(workOrderId: number, extra?: {
        customerId?: number;
        vehicleId?: number;
        protocol?: string;
        totalAmount?: number;
    }): Promise<ProductionQueueItem>;
    updateItemStatus(workOrderId: number, status: ProductionStatusEnum): Promise<void>;
    getQueueStatus(): Promise<{
        waiting: number;
        inDiagnosis: number;
        inRepair: number;
        completed: number;
        jobs: {
            waiting: {
                workOrderId: number;
                status: ProductionStatusEnum;
                createdAt: Date;
                protocol: string | null;
            }[];
            inDiagnosis: {
                workOrderId: number;
                status: ProductionStatusEnum;
                createdAt: Date;
                protocol: string | null;
            }[];
            inRepair: {
                workOrderId: number;
                status: ProductionStatusEnum;
                createdAt: Date;
                protocol: string | null;
            }[];
            completed: {
                workOrderId: number;
                status: ProductionStatusEnum;
                createdAt: Date;
                protocol: string | null;
            }[];
        };
    }>;
}
