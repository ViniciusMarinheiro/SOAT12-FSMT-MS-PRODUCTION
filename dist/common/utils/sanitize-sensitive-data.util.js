"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeSensitiveData = sanitizeSensitiveData;
function sanitizeSensitiveData(data) {
    if (!data || typeof data !== "object") {
        return data;
    }
    const sensitiveKeys = [
        "password",
        "token",
        "secret",
        "authorization",
        "auth",
    ];
    const sanitized = { ...data };
    for (const key in sanitized) {
        if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
            sanitized[key] = "***";
        }
        else if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
            sanitized[key] = sanitizeSensitiveData(sanitized[key]);
        }
    }
    return sanitized;
}
//# sourceMappingURL=sanitize-sensitive-data.util.js.map