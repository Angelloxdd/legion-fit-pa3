"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTasks = listTasks;
exports.createTask = createTask;
exports.deleteTask = deleteTask;
const mongoose_1 = require("mongoose");
const Task_1 = require("../models/Task");
async function listTasks(request, response) {
    try {
        const tasks = await Task_1.Task.find({ user: request.userId }).sort({
            createdAt: -1,
        });
        response.status(200).json({ success: true, tasks });
    }
    catch {
        response.status(500).json({
            success: false,
            message: "No se pudieron obtener las tareas.",
        });
    }
}
async function createTask(request, response) {
    const body = request.body;
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    if (!title || title.length > 120) {
        response.status(400).json({
            success: false,
            message: "El título es obligatorio y no puede superar 120 caracteres.",
        });
        return;
    }
    if (description.length > 1000) {
        response.status(400).json({
            success: false,
            message: "La descripción no puede superar 1000 caracteres.",
        });
        return;
    }
    if (!request.userId || !mongoose_1.Types.ObjectId.isValid(request.userId)) {
        response.status(401).json({
            success: false,
            message: "No se pudo identificar al usuario autenticado.",
        });
        return;
    }
    try {
        const task = await Task_1.Task.create({
            title,
            description,
            user: request.userId,
        });
        response.status(201).json({
            success: true,
            message: "Tarea creada correctamente.",
            task,
        });
    }
    catch {
        response.status(500).json({
            success: false,
            message: "No se pudo crear la tarea.",
        });
    }
}
async function deleteTask(request, response) {
    const id = request.params.id;
    if (typeof id !== "string" || !mongoose_1.Types.ObjectId.isValid(id)) {
        response.status(400).json({
            success: false,
            message: "El identificador de la tarea no es válido.",
        });
        return;
    }
    try {
        const task = await Task_1.Task.findOneAndDelete({
            _id: id,
            user: request.userId,
        });
        if (!task) {
            response.status(404).json({
                success: false,
                message: "Tarea no encontrada.",
            });
            return;
        }
        response.status(200).json({
            success: true,
            message: "Tarea eliminada correctamente.",
        });
    }
    catch {
        response.status(500).json({
            success: false,
            message: "No se pudo eliminar la tarea.",
        });
    }
}
