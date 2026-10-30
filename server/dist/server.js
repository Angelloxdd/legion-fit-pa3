"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const port = Number(process.env.PORT) || 5000;
async function startServer() {
    try {
        await (0, database_1.connectDatabase)();
        app_1.default.listen(port, () => {
            console.log(`Servidor TaskFlow disponible en http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("No se pudo iniciar el servidor. Revisa la conexión con MongoDB.");
        process.exit(1);
    }
}
void startServer();
