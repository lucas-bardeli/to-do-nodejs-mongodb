import { Router } from "express";
import TarefaController from "../controllers/tarefa.controller.js";

const tarefaRoutes = Router();

tarefaRoutes.post("/", TarefaController.criarTarefa);
tarefaRoutes.get("/", TarefaController.listarTarefas);

export default tarefaRoutes;
