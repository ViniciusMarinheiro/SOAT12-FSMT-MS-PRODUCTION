import { Injectable, Logger } from "@nestjs/common";
import { UpdateProductionStatusUseCase } from "./update-production-status.use-case";
import { ProductionStatusEnum } from "../../domain/enums/production-status.enum";

@Injectable()
export class FinishProductionUseCase {
  private readonly logger = new Logger(FinishProductionUseCase.name);

  constructor(
    private readonly updateProductionStatusUseCase: UpdateProductionStatusUseCase,
  ) {}

  async execute(workOrderId: number) {
    this.logger.log(`Finalizando produção da OS ${workOrderId}`);

    // Atualizar status para COMPLETED
    await this.updateProductionStatusUseCase.execute(
      workOrderId,
      ProductionStatusEnum.COMPLETED,
    );

    this.logger.log(`Produção da OS ${workOrderId} finalizada`);
    return { workOrderId, status: "COMPLETED" };
  }
}
