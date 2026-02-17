import { RmqContext } from "@nestjs/microservices";
import { HandleMessageStrategyFactory } from "./strategy/handleMessageStrategy.service";
import { EnvConfigService } from "@/common/service/env/env-config.service";
export declare class RabbitMQController {
    private readonly strategyFactory;
    private readonly envConfigService;
    private readonly logger;
    private readonly maxRetries;
    private readonly retryDelayMs;
    private readonly dlqRepublishToMain;
    constructor(strategyFactory: HandleMessageStrategyFactory, envConfigService: EnvConfigService);
    handleMessage(data: any, context: RmqContext): Promise<void>;
    private handleDlqMessage;
    private sleep;
}
