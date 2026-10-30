import { model, Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
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
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export type UserDocument = InferSchemaType<typeof userSchema>;
export const User = model("User", userSchema);