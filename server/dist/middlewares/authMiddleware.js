"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticate(request, response, next) {
    const authorization = request.headers.authorization;
    const [scheme, token] = authorization?.split(" ") ?? [];
    if (scheme !== "Bearer" || !token) {
        response.status(401).json({
            success: false,
            message: "Se requiere un token Bearer válido.",
        });
        return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        response.status(500).json({
            success: false,
            message: "La autenticación no está configurada en el servidor.",
        });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        if (typeof payload === "string" ||
            typeof payload.sub !== "string") {
            response.status(401).json({
                success: false,
                message: "El token no contiene un usuario válido.",
            });
            return;
        }
        request.userId = payload.sub;
        next();
    }
    catch {
        response.status(401).json({
            success: false,
            message: "El token es inválido o ha expirado.",
        });
    }
}
