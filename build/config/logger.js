"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
const pino_1 = __importDefault(require("pino"));
const pino_http_1 = __importDefault(require("pino-http"));
const httpLogger = (0, pino_http_1.default)({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
    customLogLevel: (_, res, err) => {
        var _a, _b, _c;
        if (((_a = res.statusCode) !== null && _a !== void 0 ? _a : 0) >= 400 && ((_b = res.statusCode) !== null && _b !== void 0 ? _b : 0) < 500) {
            return "warn";
        }
        else if (((_c = res.statusCode) !== null && _c !== void 0 ? _c : 0) >= 500 || err) {
            return "error";
        }
        return "info";
    },
    customSuccessMessage: (_, res, responseTime) => {
        return `HTTP ${res.statusCode} ${res.req.method} ${res.req.url} - ${responseTime}ms`;
    },
    customErrorMessage: (_, res, error) => {
        return `HTTP ${res.statusCode} ${res.req.method} ${res.req.url} ${error.message}`;
    },
    serializers: {
        req: () => undefined,
        res: () => undefined,
        responseTime: () => undefined,
    },
});
exports.httpLogger = httpLogger;
const logger = (0, pino_1.default)({
    level: process.env.NODE_ENV === "test" ? "silent" : process.env.NODE_ENV !== "production" ? "debug" : "info",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
});
exports.default = logger;
