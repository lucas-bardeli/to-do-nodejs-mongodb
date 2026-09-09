import { Router } from "express";
import ChatController from "../controllers/chat.controller";

const chatRoutes = Router();

chatRoutes.post("/", ChatController.sendSaveMessage);

export default chatRoutes;
