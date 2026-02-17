"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const production_module_1 = require("./modules/production/production.module");
const guards_1 = require("./common/guards");
const core_1 = require("@nestjs/core");
const env_config_service_1 = require("./common/service/env/env-config.service");
const custom_logger_1 = require("./common/log/custom.logger");
const env_config_module_1 = require("./common/service/env/env-config.module");
const database_module_1 = require("./common/service/database/database.module");
const nestjs_pino_1 = require("nestjs-pino");
const rabbitmq_module_1 = require("./providers/rabbitmq/rabbitmq.module");
const auth_module_1 = require("./modules/auth/auth.module");
const isTest = process.env.NODE_ENV === "test";
const isDevelopment = process.env.NODE_ENV !== "production" && !isTest;
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            env_config_module_1.EnvConfigModule,
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            production_module_1.ProductionModule,
            rabbitmq_module_1.RabbitMQModule,
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    level: "trace",
                    mixin: () => {
                        return {};
                    },
                    serializers: {
                        req: (req) => ({
                            id: req.id,
                            method: req.method,
                            url: req.url,
                            query: req.query,
                            params: req.params,
                        }),
                        res: (res) => ({
                            statusCode: res.statusCode,
                        }),
                    },
                    customLogLevel: (req, res, err) => {
                        if (res.statusCode >= 500) {
                            return "error";
                        }
                        else if (res.statusCode >= 400) {
                            return "warn";
                        }
                        return "info";
                    },
                    ...(isDevelopment && {
                        transport: {
                            target: "pino-pretty",
                            options: {
                                colorize: true,
                                singleLine: false,
                                translateTime: "SYS:standard",
                                ignore: "pid,hostname",
                            },
                        },
                    }),
                },
            }),
            custom_logger_1.CustomLogger,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            env_config_service_1.EnvConfigService,
            {
                provide: core_1.APP_GUARD,
                useClass: guards_1.GlobalJwtAuthGuard,
            },
        ],
        exports: [env_config_service_1.EnvConfigService, custom_logger_1.CustomLogger],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map