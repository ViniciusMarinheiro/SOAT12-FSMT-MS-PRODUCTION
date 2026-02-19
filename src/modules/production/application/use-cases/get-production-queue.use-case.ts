import { Injectable } from "@nestjs/common";
import { ProductionQueueService } from "../services/production-queue.service";

@Injectable()
export class GetProductionQueueUseCase {
  constructor(
    private readonly productionQueueService: ProductionQueueService,
  ) {}

  async execute() {
    return this.productionQueueService.getQueueStatus();
  }
}
