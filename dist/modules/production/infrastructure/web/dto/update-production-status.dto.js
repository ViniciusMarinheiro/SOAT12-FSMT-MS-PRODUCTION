"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductionStatusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const production_status_enum_1 = require("../../../domain/enums/production-status.enum");
class UpdateProductionStatusDto {
    status;
}
exports.UpdateProductionStatusDto = UpdateProductionStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: production_status_enum_1.ProductionStatusEnum,
        example: production_status_enum_1.ProductionStatusEnum.IN_DIAGNOSIS,
        description: "Etapa da produção: IN_DIAGNOSIS (em diagnóstico), IN_REPAIR (em reparo)",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "status é obrigatório" }),
    (0, class_validator_1.IsEnum)(production_status_enum_1.ProductionStatusEnum, {
        message: `status deve ser um de: ${Object.values(production_status_enum_1.ProductionStatusEnum).join(", ")}`,
    }),
    __metadata("design:type", String)
], UpdateProductionStatusDto.prototype, "status", void 0);
//# sourceMappingURL=update-production-status.dto.js.map