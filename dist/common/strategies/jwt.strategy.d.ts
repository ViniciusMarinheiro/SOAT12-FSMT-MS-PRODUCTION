import { Strategy } from "passport-jwt";
import { EnvConfigService } from "../service/env/env-config.service";
export interface JwtPayload {
    sub: number;
    email: string;
    role?: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    constructor(configService: EnvConfigService);
    validate(payload: JwtPayload): Promise<{
        id: number;
        email: string;
        role: string | undefined;
    }>;
}
export {};
