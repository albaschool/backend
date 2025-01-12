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
exports.setupSwagger = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const logger_1 = __importDefault(require("./logger"));
const doc = {
    info: {
        version: "1.0.0",
        title: "REST API",
        description: "",
    },
    host: "localhost:3000",
    components: {
        schemas: {
            testScheme: {
                $name: "John Doe",
                $age: 29,
                about: "",
            },
        },
    },
};
const outputFile = path_1.default.join(__dirname, "../swagger-output.json");
const endpointsFiles = [path_1.default.join(__dirname, "../app.js"), path_1.default.join(__dirname, "../routes/*.js")];
const generateSwagger = (0, swagger_autogen_1.default)({ openapi: "3.1.1" })(outputFile, endpointsFiles, doc);
exports.default = generateSwagger;
const setupSwagger = (app) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (yield Promise.resolve().then(() => __importStar(require("../config/swagger")))).default;
        const filePath = path_1.default.join(__dirname, "../swagger-output.json");
        try {
            yield fs_1.promises.access(filePath);
            const swaggerDocument = yield Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
            app.use("/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
            return true;
        }
        catch (_a) {
            logger_1.default.error("swagger-output.json does not exists.");
            return false;
        }
    }
    catch (error) {
        logger_1.default.error(error, "Swagger UI failed to initialize:");
        return false;
    }
});
exports.setupSwagger = setupSwagger;
