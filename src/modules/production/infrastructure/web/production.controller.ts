import { Controller, Get, Patch, Param, Body } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateProductionStatusUseCase } from "../../application/use-cases/update-production-status.use-case";
import { GetProductionQueueUseCase } from "../../application/use-cases/get-production-queue.use-case";
import { UpdateProductionStatusDto } from "./dto/update-production-status.dto";

@ApiTags("production")
@Controller("production")
@ApiBearerAuth("Bearer")
export class ProductionController {
  constructor(
    private readonly updateProductionStatusUseCase: UpdateProductionStatusUseCase,
    private readonly getProductionQueueUseCase: GetProductionQueueUseCase,
  ) {}

  @Get("queue")
  @ApiOperation({
    summary: "Listar fila de produção",
    description:
      "Retorna todas as OS na fila com contagem por status (aguardando, diagnóstico, reparo, finalizadas).",
  })
  async getQueue() {
    return this.getProductionQueueUseCase.execute();
  }

  @Patch(":workOrderId/status")
  @ApiOperation({
    summary: "Atualizar etapa da produção (diagnóstico/reparo)",
    description:
      'Envie no body: { "status": "IN_DIAGNOSIS" } ou { "status": "IN_REPAIR" }. Altera e persiste no BD local. Para finalizar, use POST .../finish.',
  })
  async updateStatus(
    @Param("workOrderId") workOrderId: string,
    @Body() dto: UpdateProductionStatusDto,
  ) {
    return this.updateProductionStatusUseCase.execute(+workOrderId, dto.status);
  }
}
