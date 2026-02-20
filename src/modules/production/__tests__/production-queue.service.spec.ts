import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductionQueueService } from "../application/services/production-queue.service";
import { ProductionQueueItem } from "../infrastructure/database/production-queue-item.entity";
import { ProductionStatusEnum } from "../domain/enums/production-status.enum";

describe("ProductionQueueService", () => {
  let service: ProductionQueueService;
  let repo: jest.Mocked<Repository<ProductionQueueItem>>;

  const mockItem = {
    id: 1,
    workOrderId: 1,
    customerId: 10,
    vehicleId: 20,
    protocol: "20260217-000001",
    totalAmount: 500,
    status: ProductionStatusEnum.QUEUED,
    createdAt: new Date(),
    updatedAt: new Date(),
    startedAt: null,
    completedAt: null,
  } as ProductionQueueItem;

  beforeEach(async () => {
    const mockRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn((dto: any) => dto),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductionQueueService,
        {
          provide: getRepositoryToken(ProductionQueueItem),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get(ProductionQueueService);
    repo = module.get(getRepositoryToken(ProductionQueueItem));
  });

  afterEach(() => jest.clearAllMocks());

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("addWorkOrderToQueue", () => {
    it("should return existing item when already QUEUED", async () => {
      repo.findOne
        .mockResolvedValueOnce(mockItem)
        .mockResolvedValue(undefined as any);

      const result = await service.addWorkOrderToQueue(1);

      expect(result).toEqual(mockItem);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it("should re-queue and save when item exists with other status", async () => {
      const existing = { ...mockItem, status: ProductionStatusEnum.COMPLETED };
      repo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(existing as any);
      repo.save.mockResolvedValue({
        ...existing,
        status: ProductionStatusEnum.QUEUED,
      } as any);

      const result = await service.addWorkOrderToQueue(1, {
        customerId: 10,
        protocol: "P-001",
      });

      expect(repo.save).toHaveBeenCalled();
      expect(result.status).toBe(ProductionStatusEnum.QUEUED);
    });

    it("should create new item when not in queue", async () => {
      repo.findOne.mockResolvedValue(null as any);
      repo.save.mockResolvedValue(mockItem as any);

      const result = await service.addWorkOrderToQueue(2, {
        customerId: 1,
        vehicleId: 1,
        protocol: "P-002",
        totalAmount: 100,
      });

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          workOrderId: 2,
          status: ProductionStatusEnum.QUEUED,
          customerId: 1,
          protocol: "P-002",
        }),
      );
      expect(result).toEqual(mockItem);
    });

    it("should create new item with null extra when extra not provided", async () => {
      repo.findOne.mockResolvedValue(null as any);
      repo.save.mockResolvedValue(mockItem as any);

      await service.addWorkOrderToQueue(3);

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          workOrderId: 3,
          customerId: null,
          vehicleId: null,
          protocol: null,
          totalAmount: null,
        }),
      );
    });
  });

  describe("updateItemStatus", () => {
    it("should create and save when item not found", async () => {
      repo.findOne.mockResolvedValue(null as any);
      repo.create.mockImplementation((dto: any) => dto);
      repo.save.mockResolvedValue(mockItem as any);

      await service.updateItemStatus(1, ProductionStatusEnum.IN_DIAGNOSIS);

      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
    });

    it("should update existing item and set startedAt for IN_DIAGNOSIS", async () => {
      const item = { ...mockItem, startedAt: null };
      repo.findOne.mockResolvedValue(item as any);
      repo.save.mockResolvedValue(item as any);

      await service.updateItemStatus(1, ProductionStatusEnum.IN_DIAGNOSIS);

      expect(item.status).toBe(ProductionStatusEnum.IN_DIAGNOSIS);
      expect(repo.save).toHaveBeenCalled();
    });

    it("should set completedAt when status is COMPLETED", async () => {
      const item = { ...mockItem, status: ProductionStatusEnum.IN_REPAIR };
      repo.findOne.mockResolvedValue(item as any);
      repo.save.mockResolvedValue(item as any);

      await service.updateItemStatus(1, ProductionStatusEnum.COMPLETED);

      expect(item.status).toBe(ProductionStatusEnum.COMPLETED);
      expect(item.completedAt).toBeDefined();
      expect(repo.save).toHaveBeenCalled();
    });

    it("should create new item with COMPLETED and set startedAt and completedAt", async () => {
      repo.findOne.mockResolvedValue(null as any);
      repo.create.mockImplementation((dto: any) => dto);
      repo.save.mockResolvedValue(mockItem as any);

      await service.updateItemStatus(2, ProductionStatusEnum.COMPLETED);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          workOrderId: 2,
          status: ProductionStatusEnum.COMPLETED,
        }),
      );
      const created = repo.create.mock.calls[0][0];
      expect(created.startedAt).toBeDefined();
      expect(created.completedAt).toBeDefined();
    });

    it("should not set startedAt again when item already has startedAt", async () => {
      const item = { ...mockItem, startedAt: new Date("2026-01-01") };
      repo.findOne.mockResolvedValue(item as any);
      repo.save.mockResolvedValue(item as any);

      await service.updateItemStatus(1, ProductionStatusEnum.IN_DIAGNOSIS);

      expect(repo.save).toHaveBeenCalled();
      expect(item.startedAt).toEqual(new Date("2026-01-01"));
    });
  });

  describe("getQueueStatus", () => {
    it("should return counts and jobs by status", async () => {
      const items = [
        { ...mockItem, status: ProductionStatusEnum.QUEUED },
        {
          ...mockItem,
          id: 2,
          workOrderId: 2,
          status: ProductionStatusEnum.IN_DIAGNOSIS,
        },
        {
          ...mockItem,
          id: 3,
          workOrderId: 3,
          status: ProductionStatusEnum.COMPLETED,
        },
      ] as ProductionQueueItem[];
      repo.find.mockResolvedValue(items);

      const result = await service.getQueueStatus();

      expect(result.waiting).toBe(1);
      expect(result.inDiagnosis).toBe(1);
      expect(result.inRepair).toBe(0);
      expect(result.completed).toBe(1);
      expect(result.jobs.waiting).toHaveLength(1);
      expect(result.jobs.completed).toHaveLength(1);
    });
  });
});
