import { Test, TestingModule } from "@nestjs/testing";
import { SagaCompensateProductionStrategy } from "./sagaCompensateProductionStrategy.service";
import { ProductionQueueService } from "@/modules/production/application/services/production-queue.service";
import { SAGA_STEP_SEND_TO_PRODUCTION } from "../saga/saga.types";

describe("SagaCompensateProductionStrategy", () => {
  let strategy: SagaCompensateProductionStrategy;
  let productionQueueService: jest.Mocked<ProductionQueueService>;

  beforeEach(async () => {
    const mockQueueService = {
      removeFromQueueByWorkOrderId: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SagaCompensateProductionStrategy,
        { provide: ProductionQueueService, useValue: mockQueueService },
      ],
    }).compile();

    strategy = module.get(SagaCompensateProductionStrategy);
    productionQueueService = module.get(ProductionQueueService);
  });

  afterEach(() => jest.clearAllMocks());

  it("should be defined", () => {
    expect(strategy).toBeDefined();
  });

  it("should throw when payload is invalid (missing workOrderId)", async () => {
    await expect(strategy.handle({ step: SAGA_STEP_SEND_TO_PRODUCTION })).rejects.toThrow(
      "Payload inválido: workOrderId e step obrigatórios",
    );
    expect(productionQueueService.removeFromQueueByWorkOrderId).not.toHaveBeenCalled();
  });

  it("should throw when payload is invalid (missing step)", async () => {
    await expect(strategy.handle({ workOrderId: 1 })).rejects.toThrow(
      "Payload inválido: workOrderId e step obrigatórios",
    );
  });

  it("should ignore when step is not SAGA_STEP_SEND_TO_PRODUCTION", async () => {
    await strategy.handle({
      workOrderId: 1,
      step: "other_step",
      sagaId: "s1",
    });

    expect(productionQueueService.removeFromQueueByWorkOrderId).not.toHaveBeenCalled();
  });

  it("should call removeFromQueueByWorkOrderId when step is send_to_production", async () => {
    await strategy.handle({
      workOrderId: 5,
      step: SAGA_STEP_SEND_TO_PRODUCTION,
      sagaId: "s1",
    });

    expect(productionQueueService.removeFromQueueByWorkOrderId).toHaveBeenCalledWith(5);
  });

  it("should accept payload as JSON string", async () => {
    const payload = JSON.stringify({
      workOrderId: 3,
      step: SAGA_STEP_SEND_TO_PRODUCTION,
      sagaId: "s2",
    });
    await strategy.handle(payload);
    expect(productionQueueService.removeFromQueueByWorkOrderId).toHaveBeenCalledWith(3);
  });

  it("should not throw when removeFromQueueByWorkOrderId returns false", async () => {
    productionQueueService.removeFromQueueByWorkOrderId.mockResolvedValue(false);
    await expect(
      strategy.handle({
        workOrderId: 1,
        step: SAGA_STEP_SEND_TO_PRODUCTION,
        sagaId: "s1",
      }),
    ).resolves.toBeUndefined();
  });
});
