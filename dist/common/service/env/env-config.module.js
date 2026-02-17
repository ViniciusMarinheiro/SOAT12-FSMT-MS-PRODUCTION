"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvConfigModule = void 0;
const common_1 = require("@nestjs/common");
const env_config_service_1 = require("./env-config.service");
const config_1 = require("@nestjs/config");
const env_1 = require("./env");
let EnvConfigModule = class EnvConfigModule {
};
exports.EnvConfigModule = EnvConfigModule;
exports.EnvConfigModule = EnvConfigModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: [".env"],
                validate: (env) => {
                    return env_1.envSchema.parse(env);
                },
                isGlobal: true,
                cache: true,
                expandVariables: true,
            }),
        ],
        providers: [env_config_service_1.EnvConfigService],
        exports: [env_config_service_1.EnvConfigService],
    })
], EnvConfigModule);
//# sourceMappingURL=env-config.module.js.map