import { PinoLogger } from "nestjs-pino";
import { LoggerService } from "@nestjs/common";
export declare class CustomLogger implements LoggerService {
    private readonly logger;
    private static contextRules;
    private readonly DEFAULT_CONTEXT;
    private readonly DEFAULT_LEVEL;
    private readonly LOG_LEVEL_MAP;
    constructor(logger: PinoLogger);
    verbose(message: string, context?: string | any): void;
    debug(message: string, context?: string | any): void;
    log(message: string, context?: string | any): void;
    warn(message: string, context?: string | any): void;
    error(message: string, trace?: string, context?: string | any): void;
    private initializeContextRules;
    private shouldLog;
    private getLogLevel;
}
