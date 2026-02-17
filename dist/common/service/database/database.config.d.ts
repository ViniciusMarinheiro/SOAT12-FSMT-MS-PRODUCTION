import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EnvConfigService } from "../env/env-config.service";
export declare const databaseConfig: (envConfigService: EnvConfigService) => TypeOrmModuleOptions;
