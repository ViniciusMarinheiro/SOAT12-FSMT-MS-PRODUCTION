import { UpdateProductionStatusUseCase } from "./update-production-status.use-case";
export declare class FinishProductionUseCase {
    private readonly updateProductionStatusUseCase;
    private readonly logger;
    constructor(updateProductionStatusUseCase: UpdateProductionStatusUseCase);
    execute(workOrderId: number): Promise<{
        workOrderId: number;
        status: string;
    }>;
}
