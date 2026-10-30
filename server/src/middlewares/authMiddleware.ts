import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export function authenticate(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
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
    const payload = jwt.verify(token, secret);

    if (
      typeof payload === "string" ||
      typeof (payload as JwtPayload).sub !== "string"
    ) {
      response.status(401).json({
        success: false,
        message: "El token no contiene un usuario válido.",
      });
      return;
    }

    request.userId = (payload as JwtPayload).sub;
    next();
  } catch {
    response.status(401).json({
      success: false,
      message: "El token es inválido o ha expirado.",
    });
  }
}