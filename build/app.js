"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const swagger_1 = require("./config/swagger");
const db_1 = require("./db");
const logger_1 = __importStar(require("./config/logger"));
const default_route_1 = __importDefault(require("./routes/default.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(logger_1.httpLogger);
app.use((0, cors_1.default)({
    origin: [`http://localhost:${config_1.default.http.port}`, `http://127.0.0.1:${config_1.default.http.port}`, ...config_1.default.http.cors],
    credentials: true,
}));
if (config_1.default.node.env === "development") {
    (() => __awaiter(void 0, void 0, void 0, function* () { return yield (0, swagger_1.setupSwagger)(app); }))();
}
(0, db_1.checkDbEstablished)();
app.use("/", default_route_1.default);
app.use("/auth", auth_route_1.default);
app.listen(parseInt(config_1.default.http.port), config_1.default.http.host, () => {
    logger_1.default.info(`Node environment: ${config_1.default.node.env}`);
    logger_1.default.info(`Server is running on http://${config_1.default.http.host}:${config_1.default.http.port}`);
    if (config_1.default.node.env === "development") {
        logger_1.default.info(`Swagger UI is running on http://${config_1.default.http.host}:${config_1.default.http.port}/swagger`);
    }
});
