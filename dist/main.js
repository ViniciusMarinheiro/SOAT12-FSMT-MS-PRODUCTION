"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pg_1 = require("pg");
const custom_logger_1 = require("./common/log/custom.logger");
const env_config_service_1 = require("./common/service/env/env-config.service");
const helmet_1 = require("helmet");
const rabbitmq_setup_service_1 = require("./providers/rabbitmq/rabbitmq.setup.service");
const rabbitmq_service_1 = require("./providers/rabbitmq/rabbitmq.service");
(0, dotenv_1.config)();
async function ensureSchemaExists() {
    if (process.env.NODE_ENV === "test")
        return;
    const schemaName = process.env.DB_SCHEMA || "production";
    if (schemaName === "public")
        return;
    const client = new pg_1.Client({
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        user: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_DATABASE || "postgres",
    });
    try {
        await client.connect();
        await client.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    }
    finally {
        await client.end();
    }
}
async function bootstrap() {
    await ensureSchemaExists();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ["error", "warn", "debug", "log", "verbose"],
    });
    app.useLogger(app.get(custom_logger_1.CustomLogger));
    const logger = new common_1.Logger("MAIN");
    app.enableCors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        allowedHeaders: "Content-Type, Accept, Authorization, x-time-zone",
        credentials: false,
    });
    const envConfigService = app.get(env_config_service_1.EnvConfigService);
    const port = envConfigService.get("PORT");
    const rabbitmqUrl = envConfigService.get("RABBITMQ_URL");
    if (rabbitmqUrl) {
        try {
            const setup = app.get(rabbitmq_setup_service_1.RabbitMQSetupService);
            await setup.createExchangesAndQueues(rabbitmqUrl);
            logger.log("RabbitMQ exchanges e filas criadas");
        }
        catch (error) {
            logger.warn("RabbitMQ setup falhou, continuando", error instanceof Error ? error.message : String(error));
        }
        rabbitmq_service_1.RabbitMQService.connectMicroservices(app, rabbitmqUrl);
        rabbitmq_service_1.RabbitMQService.connectDlqMicroservices(app, rabbitmqUrl);
        logger.log("RabbitMQ consumers (principal + DLQ) registrados");
    }
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.setGlobalPrefix(envConfigService.get("DOCUMENTATION_PREFIX"));
    app.use((0, helmet_1.default)());
    const config = new swagger_1.DocumentBuilder()
        .setTitle("P&S Tech - 12SOAT Production Service")
        .setDescription("Microserviço de Execução e Produção")
        .setVersion("1.0")
        .addBearerAuth({
        type: "http",
        scheme: "bearer",
        bearerFormat: "Token",
    }, "Bearer")
        .build();
    const documentationPrefix = envConfigService.get("DOCUMENTATION_PREFIX");
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(documentationPrefix + "/documentation", app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    app
        .getHttpAdapter()
        .get(`/${documentationPrefix}/documentation/json`, (req, res) => {
        res.send(document);
    });
    await app.listen(port);
    if (rabbitmqUrl) {
        await app.startAllMicroservices();
    }
    logger.log(`HTTP server started on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map