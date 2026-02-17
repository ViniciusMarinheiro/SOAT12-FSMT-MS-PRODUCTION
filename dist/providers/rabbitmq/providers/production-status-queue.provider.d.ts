import { ClientProxy } from "@nestjs/microservices";
export interface SendStatusUpdatePayload {
    workOrderId: number;
    status: string;
    startedAt?: Date;
    finishedAt?: Date;
}
export declare class ProductionStatusQueueProvider {
    private readonly client;
    private readonly logger;
    constructor(client: ClientProxy);
    sendStatusUpdate(payload: SendStatusUpdatePayload): Promise<void>;
}
