import { ProductionQueueService } from "../services/production-queue.service";
export declare class GetProductionQueueUseCase {
    private readonly productionQueueService;
    constructor(productionQueueService: ProductionQueueService);
    execute(): Promise<{
        waiting: number;
        inDiagnosis: number;
        inRepair: number;
        completed: number;
        jobs: {
            waiting: {
                workOrderId: number;
                status: import("../../domain/enums/production-status.enum").ProductionStatusEnum;
                createdAt: Date;
                protocol: string | null;
            }[];
            inDiagnosis: {
                workOrderId: number;
                status: import("../../domain/enums/production-status.enum").ProductionStatusEnum;
                createdAt: Date;
                protocol: string | null;
            }[];
            inRepair: {
                workOrderId: number;
                status: import("../../domain/enums/production-status.enum").ProductionStatusEnum;
                createdAt: Date;
                protocol: string | null;
            }[];
            completed: {
                workOrderId: number;
                status: import("../../domain/enums/production-status.enum").ProductionStatusEnum;
                createdAt: Date;
                protocol: string | null;
            }[];
        };
    }>;
}
