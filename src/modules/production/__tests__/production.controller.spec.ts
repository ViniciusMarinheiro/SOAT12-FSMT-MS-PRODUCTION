import { Test, TestingModule } from "@nestjs/testing";
import { ProductionController } from "../infrastructure/web/production.controller";
import { UpdateProductionStatusUseCase } from "../application/use-cases/update-production-status.use-case";
import { GetProductionQueueUseCase } from "../application/use-cases/get-production-queue.use-case";

describe("ProductionController", () => {
  let controller: ProductionController;
  let updateStatusUseCase: jest.Mocked<UpdateProductionStatusUseCase>;
  let getQueueUseCase: jest.Mocked<GetProductionQueueUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionController],
      providers: [
        {
          provide: UpdateProductionStatusUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetProductionQueueUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get(ProductionController);
    updateStatusUseCase = module.get(UpdateProductionStatusUseCase);
    getQueueUseCase = module.get(GetProductionQueueUseCase);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("getQueue should call getProductionQueueUseCase.execute", async () => {
    const queueStatus = {
      waiting: 1,
      inDiagnosis: 0,
      inRepair: 0,
      completed: 0,
      jobs: {} as any,
    };
    getQueueUseCase.execute.mockResolvedValue(queueStatus as any);

    const result = await controller.getQueue();

    expect(getQueueUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual(queueStatus);
  });
});
