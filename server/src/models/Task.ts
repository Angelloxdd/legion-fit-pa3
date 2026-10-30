import { model, Schema, type InferSchemaType } from "mongoose";

const taskSchema = new Schema(
  {
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export type TaskDocument = InferSchemaType<typeof taskSchema>;
export const Task = model("Task", taskSchema);