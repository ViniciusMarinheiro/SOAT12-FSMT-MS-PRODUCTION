import { Test, TestingModule } from "@nestjs/testing";
import { GetProductionQueueUseCase } from "../application/use-cases/get-production-queue.use-case";
import { ProductionQueueService } from "../application/services/production-queue.service";

describe("GetProductionQueueUseCase", () => {
  let useCase: GetProductionQueueUseCase;
  let productionQueueService: jest.Mocked<ProductionQueueService>;

  beforeEach(async () => {
    const mockQueueService = {
      getQueueStatus: jest.fn().mockResolvedValue({
        waiting: 2,
        inDiagnosis: 1,
        inRepair: 0,
        completed: 3,
        jobs: { waiting: [], inDiagnosis: [], inRepair: [], completed: [] },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductionQueueUseCase,
        { provide: ProductionQueueService, useValue: mockQueueService },
      ],
    }).compile();

    useCase = module.get(GetProductionQueueUseCase);
    productionQueueService = module.get(ProductionQueueService);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should return queue status from productionQueueService", async () => {
    const result = await useCase.execute();

    expect(productionQueueService.getQueueStatus).toHaveBeenCalled();
    expect(result.waiting).toBe(2);
    expect(result.completed).toBe(3);
  });
});
