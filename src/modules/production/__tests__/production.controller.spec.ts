import { Test, TestingModule } from "@nestjs/testing";
import { ProductionController } from "../infrastructure/web/production.controller";
import { UpdateProductionStatusUseCase } from "../application/use-cases/update-production-status.use-case";
import { GetProductionQueueUseCase } from "../application/use-cases/get-production-queue.use-case";
import { FinishProductionUseCase } from "../application/use-cases/finish-production.use-case";
import { ProductionQueueService } from "../application/services/production-queue.service";
import { ProductionStatusEnum } from "../domain/enums/production-status.enum";

describe("ProductionController", () => {
  let controller: ProductionController;
  let updateStatusUseCase: jest.Mocked<UpdateProductionStatusUseCase>;
  let getQueueUseCase: jest.Mocked<GetProductionQueueUseCase>;
  let finishUseCase: jest.Mocked<FinishProductionUseCase>;
  let productionQueueService: jest.Mocked<ProductionQueueService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionController],
      providers: [
        { provide: UpdateProductionStatusUseCase, useValue: { execute: jest.fn() } },
        { provide: GetProductionQueueUseCase, useValue: { execute: jest.fn() } },
        { provide: FinishProductionUseCase, useValue: { execute: jest.fn() } },
        { provide: ProductionQueueService, useValue: { addWorkOrderToQueue: jest.fn() } },
      ],
    }).compile();

    controller = module.get(ProductionController);
    updateStatusUseCase = module.get(UpdateProductionStatusUseCase);
    getQueueUseCase = module.get(GetProductionQueueUseCase);
    finishUseCase = module.get(FinishProductionUseCase);
    productionQueueService = module.get(ProductionQueueService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("addToQueue should call productionQueueService.addWorkOrderToQueue", async () => {
    const item = {
      workOrderId: 1,
      status: ProductionStatusEnum.QUEUED,
      createdAt: new Date(),
    } as any;
    productionQueueService.addWorkOrderToQueue.mockResolvedValue(item);

    const result = await controller.addToQueue("1");

    expect(productionQueueService.addWorkOrderToQueue).toHaveBeenCalledWith(1);
    expect(result.workOrderId).toBe(1);
    expect(result.status).toBe(ProductionStatusEnum.QUEUED);
  });

  it("getQueue should call getProductionQueueUseCase.execute", async () => {
    const queueStatus = { waiting: 1, inDiagnosis: 0, inRepair: 0, completed: 0, jobs: {} as any };
    getQueueUseCase.execute.mockResolvedValue(queueStatus as any);

    const result = await controller.getQueue();

    expect(getQueueUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual(queueStatus);
  });

  it("updateStatus should call updateProductionStatusUseCase.execute", async () => {
    const updated = { workOrderId: 1, status: ProductionStatusEnum.IN_REPAIR, message: "ok" };
    updateStatusUseCase.execute.mockResolvedValue(updated as any);

    const result = await controller.updateStatus("1", { status: ProductionStatusEnum.IN_REPAIR } as any);

    expect(updateStatusUseCase.execute).toHaveBeenCalledWith(1, ProductionStatusEnum.IN_REPAIR);
    expect(result).toEqual(updated);
  });

  it("finish should call finishProductionUseCase.execute", async () => {
    const finished = { workOrderId: 1, status: "COMPLETED" };
    finishUseCase.execute.mockResolvedValue(finished as any);

    const result = await controller.finish("1");

    expect(finishUseCase.execute).toHaveBeenCalledWith(1);
    expect(result).toEqual(finished);
  });
});
