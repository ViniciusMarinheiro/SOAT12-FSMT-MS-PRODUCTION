import { Logger } from "@nestjs/common";
import { MessageHandler } from "../types/message.interface";
import { ProductionQueueService } from "@/modules/production/application/services/production-queue.service";
export interface ReceiveWorkOrderPayload {
    workOrderId: number;
    customerId: number;
    vehicleId: number;
    protocol: string;
    totalAmount: number;
}
export declare class ReceiveWorkOrderStrategy implements MessageHandler<ReceiveWorkOrderPayload> {
    private readonly productionQueueService;
    protected readonly logger: Logger;
    constructor(productionQueueService: ProductionQueueService);
    private validatePayload;
    handle(payload: any): Promise<void>;
}
