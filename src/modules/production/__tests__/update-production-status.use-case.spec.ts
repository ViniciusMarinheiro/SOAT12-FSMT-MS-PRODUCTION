import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { UpdateProductionStatusUseCase } from "../application/use-cases/update-production-status.use-case";
import { ProductionStatusQueueProvider } from "@/providers/rabbitmq/providers/production-status-queue.provider";
import { ProductionQueueService } from "../application/services/production-queue.service";
import { ProductionStatusEnum } from "../domain/enums/production-status.enum";

describe("UpdateProductionStatusUseCase", () => {
  let useCase: UpdateProductionStatusUseCase;
  let productionStatusQueueProvider: jest.Mocked<ProductionStatusQueueProvider>;
  let productionQueueService: jest.Mocked<ProductionQueueService>;

  beforeEach(async () => {
    const mockQueueProvider = {
      sendStatusUpdate: jest.fn().mockResolvedValue(undefined),
    };
    const mockQueueService = {
      getItemByWorkOrderId: jest.fn().mockResolvedValue(null),
      updateItemStatus: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProductionStatusUseCase,
        { provide: ProductionStatusQueueProvider, useValue: mockQueueProvider },
        { provide: ProductionQueueService, useValue: mockQueueService },
      ],
    }).compile();

    useCase = module.get(UpdateProductionStatusUseCase);
    productionStatusQueueProvider = module.get(ProductionStatusQueueProvider);
    productionQueueService = module.get(ProductionQueueService);
  });

  afterEach(() => jest.clearAllMocks());

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should update status and send to MS-ORDER when COMPLETED", async () => {
    productionQueueService.getItemByWorkOrderId.mockResolvedValue({
      workOrderId: 1,
      status: ProductionStatusEnum.IN_REPAIR,
    } as any);

    const result = await useCase.execute(1, ProductionStatusEnum.COMPLETED);

    expect(productionQueueService.updateItemStatus).toHaveBeenCalledWith(
      1,
      ProductionStatusEnum.COMPLETED,
    );
    expect(productionStatusQueueProvider.sendStatusUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        workOrderId: 1,
        status: "FINISHED",
        finishedAt: expect.any(Date),
      }),
    );
    expect(result).toEqual({
      workOrderId: 1,
      status: ProductionStatusEnum.COMPLETED,
      message: expect.stringContaining("atualizado para COMPLETED"),
    });
  });

  it("should update status locally only when not COMPLETED", async () => {
    productionQueueService.getItemByWorkOrderId.mockResolvedValue({
      workOrderId: 1,
      status: ProductionStatusEnum.IN_DIAGNOSIS,
    } as any);

    const result = await useCase.execute(1, ProductionStatusEnum.IN_REPAIR);

    expect(productionQueueService.updateItemStatus).toHaveBeenCalledWith(
      1,
      ProductionStatusEnum.IN_REPAIR,
    );
    expect(
      productionStatusQueueProvider.sendStatusUpdate,
    ).not.toHaveBeenCalled();
    expect(result.status).toBe(ProductionStatusEnum.IN_REPAIR);
  });

  it("should throw when productionQueueService throws", async () => {
    productionQueueService.getItemByWorkOrderId.mockResolvedValue({
      workOrderId: 1,
      status: ProductionStatusEnum.QUEUED,
    } as any);
    productionQueueService.updateItemStatus.mockRejectedValue(
      new Error("DB error"),
    );

    await expect(
      useCase.execute(1, ProductionStatusEnum.IN_DIAGNOSIS),
    ).rejects.toThrow("DB error");
  });

  it("should map IN_DIAGNOSIS to DIAGNOSING when sending status", async () => {
    productionQueueService.getItemByWorkOrderId.mockResolvedValue({
      workOrderId: 1,
      status: ProductionStatusEnum.IN_REPAIR,
    } as any);
    await useCase.execute(1, ProductionStatusEnum.COMPLETED);

    expect(productionStatusQueueProvider.sendStatusUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ status: "FINISHED" }),
    );
  });

  it("should update and not send when status is QUEUED (new item)", async () => {
    productionQueueService.getItemByWorkOrderId.mockResolvedValue(null);

    const result = await useCase.execute(1, ProductionStatusEnum.QUEUED);

    expect(productionQueueService.updateItemStatus).toHaveBeenCalledWith(
      1,
      ProductionStatusEnum.QUEUED,
    );
    expect(
      productionStatusQueueProvider.sendStatusUpdate,
    ).not.toHaveBeenCalled();
    expect(result.status).toBe(ProductionStatusEnum.QUEUED);
  });

  it("should throw when current status is already COMPLETED", async () => {
    productionQueueService.getItemByWorkOrderId.mockResolvedValue({
      workOrderId: 1,
      status: ProductionStatusEnum.COMPLETED,
    } as any);

    await expect(
      useCase.execute(1, ProductionStatusEnum.IN_REPAIR),
    ).rejects.toThrow(BadRequestException);

    await expect(
      useCase.execute(1, ProductionStatusEnum.COMPLETED),
    ).rejects.toThrow(BadRequestException);

    expect(productionQueueService.updateItemStatus).not.toHaveBeenCalled();
    expect(
      productionStatusQueueProvider.sendStatusUpdate,
    ).not.toHaveBeenCalled();
  });

  it("should throw when trying to revert to previous status", async () => {
    productionQueueService.getItemByWorkOrderId.mockResolvedValue({
      workOrderId: 1,
      status: ProductionStatusEnum.IN_REPAIR,
    } as any);

    await expect(
      useCase.execute(1, ProductionStatusEnum.QUEUED),
    ).rejects.toThrow(BadRequestException);

    await expect(
      useCase.execute(1, ProductionStatusEnum.IN_DIAGNOSIS),
    ).rejects.toThrow(BadRequestException);

    expect(productionQueueService.updateItemStatus).not.toHaveBeenCalled();
  });
});
