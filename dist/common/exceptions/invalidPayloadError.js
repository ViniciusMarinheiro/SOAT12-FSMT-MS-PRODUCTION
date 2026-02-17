"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidPayloadError = void 0;
const common_1 = require("@nestjs/common");
class InvalidPayloadError extends common_1.HttpException {
    constructor(message) {
        super({
            status: common_1.HttpStatus.BAD_REQUEST,
            message,
            timestamp: new Date().toISOString(),
        }, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InvalidPayloadError = InvalidPayloadError;
//# sourceMappingURL=invalidPayloadError.js.map