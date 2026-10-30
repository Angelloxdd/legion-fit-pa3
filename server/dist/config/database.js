"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDatabase() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error("Falta configurar MONGODB_URI en el archivo .env");
    }
    await mongoose_1.default.connect(mongoUri);
    console.log("Conexión con MongoDB establecida");
}
