import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller.js";

const usuarioRoutes = Router();

usuarioRoutes.post("/", UsuarioController.registrarUsuario);
usuarioRoutes.post("/login", UsuarioController.login);

export default usuarioRoutes;
