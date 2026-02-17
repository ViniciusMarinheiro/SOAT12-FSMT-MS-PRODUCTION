import { EnvConfigService } from "@/common/service/env/env-config.service";
export declare class RabbitMQSetupService {
    private readonly envConfigService;
    private readonly logger;
    constructor(envConfigService: EnvConfigService);
    createExchangesAndQueues(rabbitmqUrl: string): Promise<void>;
    private createExchangeAndQueue;
    private createQueue;
}
