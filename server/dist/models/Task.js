"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "El título es obligatorio"],
        trim: true,
        minlength: [1, "El título no puede estar vacío"],
        maxlength: [120, "El título no puede superar 120 caracteres"],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, "La descripción no puede superar 1000 caracteres"],
        default: "",
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
exports.Task = (0, mongoose_1.model)("Task", taskSchema);
