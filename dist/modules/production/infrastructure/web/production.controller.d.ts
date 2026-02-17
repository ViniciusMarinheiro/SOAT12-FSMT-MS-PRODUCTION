import { UpdateProductionStatusUseCase } from "../../application/use-cases/update-production-status.use-case";
import { GetProductionQueueUseCase } from "../../application/use-cases/get-production-queue.use-case";
import { FinishProductionUseCase } from "../../application/use-cases/finish-production.use-case";
import { ProductionQueueService } from "../../application/services/production-queue.service";
import { UpdateProductionStatusDto } from "./dto/update-production-status.dto";
export declare class ProductionController {
    private readonly updateProductionStatusUseCase;
    private readonly getProductionQueueUseCase;
    private readonly finishProductionUseCase;
    private readonly productionQueueService;
    constructor(updateProductionStatusUseCase: UpdateProductionStatusUseCase, getProductionQueueUseCase: GetProductionQueueUseCase, finishProductionUseCase: FinishProductionUseCase, productionQueueService: ProductionQueueService);
    addToQueue(workOrderId: string): Promise<{
        message: string;
        workOrderId: number;
        status: import("../../domain/enums/production-status.enum").ProductionStatusEnum;
        createdAt: Date;
    }>;
    getQueue(): Promise<{
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
    updateStatus(workOrderId: string, dto: UpdateProductionStatusDto): Promise<{
        workOrderId: number;
        status: import("../../domain/enums/production-status.enum").ProductionStatusEnum;
        message: string;
    }>;
    finish(workOrderId: string): Promise<{
        workOrderId: number;
        status: string;
    }>;
}
