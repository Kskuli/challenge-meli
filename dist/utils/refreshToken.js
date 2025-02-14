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
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = void 0;
const errorHandler_1 = require("../errorHandler");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const refreshToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const refreshUrl = `${process.env.MERCADO_LIBRE_API_URL}/oauth/token`;
    const body = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.MERCADO_LIBRE_API_CLIENT_ID,
        client_secret: process.env.MERCADO_LIBRE_API_CLIENT_SECRET,
        refresh_token: process.env.MERCADO_LIBRE_API_REFRESH_TOKEN,
    });
    try {
        const response = yield fetch(refreshUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(),
        });
        if (!response.ok) {
            throw new errorHandler_1.CustomError(`Failed to refresh token: ${response.statusText}`, response.status);
        }
        const data = yield response.json();
        process.env.MERCADO_LIBRE_API_TOKEN = data.access_token;
        return data.access_token;
    }
    catch (error) {
        console.error("Error refreshing token:", error);
        throw new errorHandler_1.CustomError("Token refresh failed", 400);
    }
});
exports.refreshToken = refreshToken;
//# sourceMappingURL=refreshToken.js.map