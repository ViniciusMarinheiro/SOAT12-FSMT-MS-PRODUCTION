import { Test, TestingModule } from "@nestjs/testing";
import { FinishProductionUseCase } from "../application/use-cases/finish-production.use-case";
import { UpdateProductionStatusUseCase } from "../application/use-cases/update-production-status.use-case";
import { ProductionStatusEnum } from "../domain/enums/production-status.enum";

describe("FinishProductionUseCase", () => {
  let useCase: FinishProductionUseCase;
  let updateProductionStatusUseCase: jest.Mocked<UpdateProductionStatusUseCase>;

  beforeEach(async () => {
    const mockUpdate = {
      execute: jest.fn().mockResolvedValue({ workOrderId: 1, status: ProductionStatusEnum.COMPLETED }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinishProductionUseCase,
        {
          provide: UpdateProductionStatusUseCase,
          useValue: mockUpdate,
        },
      ],
    }).compile();

    useCase = module.get(FinishProductionUseCase);
    updateProductionStatusUseCase = module.get(UpdateProductionStatusUseCase);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should call updateProductionStatusUseCase with COMPLETED and return result", async () => {
    const result = await useCase.execute(1);

    expect(updateProductionStatusUseCase.execute).toHaveBeenCalledWith(
      1,
      ProductionStatusEnum.COMPLETED,
    );
    expect(result).toEqual({ workOrderId: 1, status: "COMPLETED" });
  });
});
