import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

type AuthBody = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(
  request: Request,
  response: Response,
): Promise<void> {
  const body = request.body as AuthBody;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || !email || !password) {
    response.status(400).json({
      success: false,
      message: "Nombre, correo y contraseña son obligatorios.",
    });
    return;
  }

  if (name.length < 2 || name.length > 80) {
    response.status(400).json({
      success: false,
      message: "El nombre debe tener entre 2 y 80 caracteres.",
    });
    return;
  }

  if (!emailPattern.test(email)) {
    response.status(400).json({
      success: false,
      message: "Escribe un correo electrónico válido.",
    });
    return;
  }

  if (password.length < 8) {
    response.status(400).json({
      success: false,
      message: "La contraseña debe tener al menos 8 caracteres.",
    });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      response.status(409).json({
        success: false,
        message: "Ya existe una cuenta con ese correo.",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: passwordHash });

    response.status(201).json({
      success: true,
      message: "Cuenta creada correctamente.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch {
    response.status(500).json({
      success: false,
      message: "No se pudo registrar la cuenta.",
    });
  }
}

export async function login(
  request: Request,
  response: Response,
): Promise<void> {
  const body = request.body as AuthBody;
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    response.status(400).json({
      success: false,
      message: "Correo y contraseña son obligatorios.",
    });
    return;
  }

  if (!emailPattern.test(email)) {
    response.status(400).json({
      success: false,
      message: "Escribe un correo electrónico válido.",
    });
    return;
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      response.status(401).json({
        success: false,
        message: "Correo o contraseña incorrectos.",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      response.status(500).json({
        success: false,
        message: "El servidor no tiene configurada la autenticación.",
      });
      return;
    }

    const token = jwt.sign({ sub: user.id }, secret, { expiresIn: "1h" });

    response.status(200).json({
      success: true,
      message: "Inicio de sesión correcto.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch {
    response.status(500).json({
      success: false,
      message: "No se pudo iniciar sesión.",
    });
  }
}