import { Router } from "express";
import {
  createTask,
  deleteTask,
  listTasks,
} from "../controllers/taskController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticate);

router.get("/", listTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);

export default router;