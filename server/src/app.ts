import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
  }),
);
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "TaskFlow API está funcionando",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;