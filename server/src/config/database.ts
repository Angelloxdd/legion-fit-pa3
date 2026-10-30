import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Falta configurar MONGODB_URI en el archivo .env");
  }

  await mongoose.connect(mongoUri);
  console.log("Conexión con MongoDB establecida");
}