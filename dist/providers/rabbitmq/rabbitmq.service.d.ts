import { INestApplication } from "@nestjs/common";
import { MessageConfig } from "./types/message.interface";
import { EnvConfigService } from "@/common/service/env/env-config.service";
export declare class RabbitMQService {
    private readonly configService;
    constructor(configService: EnvConfigService);
    createClientOptions(config: MessageConfig): any;
    static registerClient(config: MessageConfig): import("@nestjs/common").DynamicModule;
    static connectMicroservices(app: INestApplication, rabbitmqUrl: string): void;
    static connectDlqMicroservices(app: INestApplication, rabbitmqUrl: string): void;
}
