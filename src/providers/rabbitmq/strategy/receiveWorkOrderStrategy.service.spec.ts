import { Test, TestingModule } from "@nestjs/testing";
import { ReceiveWorkOrderStrategy } from "./receiveWorkOrderStrategy.service";
import { ProductionQueueService } from "@/modules/production/application/services/production-queue.service";
import { InvalidPayloadError } from "@/common/exceptions/invalidPayloadError";

describe("ReceiveWorkOrderStrategy", () => {
  let strategy: ReceiveWorkOrderStrategy;
  let productionQueueService: jest.Mocked<ProductionQueueService>;

  beforeEach(async () => {
    const mockQueueService = {
      addWorkOrderToQueue: jest.fn().mockResolvedValue({ workOrderId: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiveWorkOrderStrategy,
        { provide: ProductionQueueService, useValue: mockQueueService },
      ],
    }).compile();

    strategy = module.get(ReceiveWorkOrderStrategy);
    productionQueueService = module.get(ProductionQueueService);
  });

  afterEach(() => jest.clearAllMocks());

  it("should be defined", () => {
    expect(strategy).toBeDefined();
  });

  it("should throw InvalidPayloadError when payload is null", async () => {
    await expect(strategy.handle(null)).rejects.toThrow(InvalidPayloadError);
    await expect(strategy.handle(null)).rejects.toThrow(/Payload da OS inválido/);
    expect(productionQueueService.addWorkOrderToQueue).not.toHaveBeenCalled();
  });

  it("should throw InvalidPayloadError when payload is not object", async () => {
    await expect(strategy.handle("string")).rejects.toThrow(InvalidPayloadError);
    await expect(strategy.handle(123)).rejects.toThrow(InvalidPayloadError);
  });

  it("should throw when workOrderId is missing or not number", async () => {
    await expect(strategy.handle({})).rejects.toThrow(
      /workOrderId \(number\)/,
    );
    await expect(strategy.handle({ workOrderId: "1" })).rejects.toThrow(
      /workOrderId \(number\)/,
    );
  });

  it("should call addWorkOrderToQueue with payload and extra fields", async () => {
    const payload = {
      workOrderId: 1,
      customerId: 10,
      vehicleId: 20,
      protocol: "P-001",
      totalAmount: 500,
    };

    await strategy.handle(payload);

    expect(productionQueueService.addWorkOrderToQueue).toHaveBeenCalledWith(
      1,
      {
        customerId: 10,
        vehicleId: 20,
        protocol: "P-001",
        totalAmount: 500,
      },
    );
  });

  it("should rethrow when addWorkOrderToQueue fails", async () => {
    productionQueueService.addWorkOrderToQueue.mockRejectedValue(
      new Error("DB error"),
    );

    await expect(
      strategy.handle({ workOrderId: 1, customerId: 1, vehicleId: 1, protocol: "P", totalAmount: 0 }),
    ).rejects.toThrow("DB error");
  });
});
