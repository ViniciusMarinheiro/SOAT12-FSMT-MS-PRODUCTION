import { Controller, Get, Patch, Param, Body, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateProductionStatusUseCase } from "../../application/use-cases/update-production-status.use-case";
import { GetProductionQueueUseCase } from "../../application/use-cases/get-production-queue.use-case";
import { FinishProductionUseCase } from "../../application/use-cases/finish-production.use-case";
import { ProductionQueueService } from "../../application/services/production-queue.service";
import { UpdateProductionStatusDto } from "./dto/update-production-status.dto";

@ApiTags("production")
@Controller("production")
@ApiBearerAuth("Bearer")
export class ProductionController {
  constructor(
    private readonly updateProductionStatusUseCase: UpdateProductionStatusUseCase,
    private readonly getProductionQueueUseCase: GetProductionQueueUseCase,
    private readonly finishProductionUseCase: FinishProductionUseCase,
    private readonly productionQueueService: ProductionQueueService,
  ) {}

  /** Adiciona uma OS à fila de produção e persiste no BD. */
  @Post("queue/:workOrderId")
  @ApiOperation({
    summary: "Adicionar OS à fila de produção",
    description:
      "Registra a OS na fila de produção (persiste no BD). Usado quando a OS vem pelo RabbitMQ ou para inclusão manual.",
  })
  async addToQueue(@Param("workOrderId") workOrderId: string) {
    const item =
      await this.productionQueueService.addWorkOrderToQueue(+workOrderId);
    return {
      message: "OS adicionada à fila de produção e salva no banco",
      workOrderId: item.workOrderId,
      status: item.status,
      createdAt: item.createdAt,
    };
  }

  /** Lista a fila de produção (todas as OS e status). */
  @Get("queue")
  @ApiOperation({
    summary: "Listar fila de produção",
    description:
      "Retorna todas as OS na fila com contagem por status (aguardando, diagnóstico, reparo, finalizadas).",
  })
  async getQueue() {
    return this.getProductionQueueUseCase.execute();
  }

  /** Atualiza a etapa da produção (diagnóstico ou reparo). Só persiste aqui; não notifica MS-ORDER. */
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

  /** Finaliza a produção e notifica o MS-ORDER (OS Service). */
  @Post(":workOrderId/finish")
  @ApiOperation({
    summary: "Finalizar produção e notificar MS-ORDER",
    description:
      "Marca a OS como COMPLETED, persiste no BD e envia notificação ao MS-ORDER para atualizar a OS como FINISHED.",
  })
  async finish(@Param("workOrderId") workOrderId: string) {
    return this.finishProductionUseCase.execute(+workOrderId);
  }
}
