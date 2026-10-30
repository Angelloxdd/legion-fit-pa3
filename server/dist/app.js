"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
}));
app.use(express_1.default.json());
app.get("/api/health", (_request, response) => {
    response.status(200).json({
        success: true,
        message: "TaskFlow API está funcionando",
    });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/tasks", taskRoutes_1.default);
exports.default = app;
