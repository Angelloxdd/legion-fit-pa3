import "dotenv/config";
import app from "./app";
import { connectDatabase } from "./config/database";

const port = Number(process.env.PORT) || 5000;

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Servidor TaskFlow disponible en http://localhost:${port}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor. Revisa la conexión con MongoDB.");
    process.exit(1);
  }
}

void startServer();