import { Router } from "express";
import TarefaController from "../controllers/tarefa.controller.js";

const router = Router();

router.post("/", TarefaController.criarTarefa);
router.get("/", TarefaController.listarTarefas);

export default router;
