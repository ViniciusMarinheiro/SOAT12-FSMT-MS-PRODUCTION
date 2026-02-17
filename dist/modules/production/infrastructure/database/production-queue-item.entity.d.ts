import { ProductionStatusEnum } from "../../domain/enums/production-status.enum";
export declare class ProductionQueueItem {
    id: number;
    workOrderId: number;
    customerId: number | null;
    vehicleId: number | null;
    protocol: string | null;
    totalAmount: number | null;
    status: ProductionStatusEnum;
    createdAt: Date;
    updatedAt: Date;
    startedAt: Date | null;
    completedAt: Date | null;
}
