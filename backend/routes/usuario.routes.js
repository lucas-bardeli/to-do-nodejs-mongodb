import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller.js";

const usuarioRoutes = Router();

usuarioRoutes.post("/", UsuarioController.registrarUsuario);

export default usuarioRoutes;
