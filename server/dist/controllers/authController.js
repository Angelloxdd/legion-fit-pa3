"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
async function register(request, response) {
    const body = request.body;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
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
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            response.status(409).json({
                success: false,
                message: "Ya existe una cuenta con ese correo.",
            });
            return;
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        const user = await User_1.User.create({ name, email, password: passwordHash });
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
    }
    catch {
        response.status(500).json({
            success: false,
            message: "No se pudo registrar la cuenta.",
        });
    }
}
async function login(request, response) {
    const body = request.body;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
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
        const user = await User_1.User.findOne({ email }).select("+password");
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
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
        const token = jsonwebtoken_1.default.sign({ sub: user.id }, secret, { expiresIn: "1h" });
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
    }
    catch {
        response.status(500).json({
            success: false,
            message: "No se pudo iniciar sesión.",
        });
    }
}
