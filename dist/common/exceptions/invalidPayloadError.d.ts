import { HttpException } from "@nestjs/common";
export declare class InvalidPayloadError extends HttpException {
    constructor(message: string);
}
