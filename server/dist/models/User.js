"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true,
        minlength: [2, "El nombre debe tener al menos 2 caracteres"],
        maxlength: [80, "El nombre no puede superar 80 caracteres"],
    },
    email: {
        type: String,
        required: [true, "El correo electrónico es obligatorio"],
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: [254, "El correo electrónico es demasiado largo"],
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        select: false,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
exports.User = (0, mongoose_1.model)("User", userSchema);
