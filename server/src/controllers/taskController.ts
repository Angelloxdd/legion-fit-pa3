import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Task } from "../models/Task";

type TaskBody = {
  title?: unknown;
  description?: unknown;
};

export async function listTasks(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const tasks = await Task.find({ user: request.userId }).sort({
      createdAt: -1,
    });

    response.status(200).json({ success: true, tasks });
  } catch {
    response.status(500).json({
      success: false,
      message: "No se pudieron obtener las tareas.",
    });
  }
}

export async function createTask(
  request: Request,
  response: Response,
): Promise<void> {
  const body = request.body as TaskBody;
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";

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

  if (!request.userId || !Types.ObjectId.isValid(request.userId)) {
    response.status(401).json({
      success: false,
      message: "No se pudo identificar al usuario autenticado.",
    });
    return;
  }

  try {
    const task = await Task.create({
      title,
      description,
      user: request.userId,
    });

    response.status(201).json({
      success: true,
      message: "Tarea creada correctamente.",
      task,
    });
  } catch {
    response.status(500).json({
      success: false,
      message: "No se pudo crear la tarea.",
    });
  }
}

export async function deleteTask(
  request: Request,
  response: Response,
): Promise<void> {
const id = request.params.id;

if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
    response.status(400).json({
      success: false,
      message: "El identificador de la tarea no es válido.",
    });
    return;
  }

  try {
    const task = await Task.findOneAndDelete({
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
  } catch {
    response.status(500).json({
      success: false,
      message: "No se pudo eliminar la tarea.",
    });
  }
}