import { ConfigService } from "@nestjs/config";
import { Env } from "./env";
export declare class EnvConfigService {
    private readonly configService;
    constructor(configService: ConfigService<Env, true>);
    get<Key extends keyof Env>(key: Key): Env[Key];
}
