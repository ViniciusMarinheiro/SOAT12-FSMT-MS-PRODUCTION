import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { ProductionStatusEnum } from "../../../domain/enums/production-status.enum";

export class UpdateProductionStatusDto {
  @ApiProperty({
    enum: ProductionStatusEnum,
    example: ProductionStatusEnum.IN_DIAGNOSIS,
    description:
      "Etapa da produção: IN_DIAGNOSIS (em diagnóstico), IN_REPAIR (em reparo)",
  })
  @IsNotEmpty({ message: "status é obrigatório" })
  @IsEnum(ProductionStatusEnum, {
    message: `status deve ser um de: ${Object.values(ProductionStatusEnum).join(", ")}`,
  })
  status: ProductionStatusEnum;
}
