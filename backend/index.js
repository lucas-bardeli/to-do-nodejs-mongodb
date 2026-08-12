import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import tarefaRoutes from "./routes/tarefa.routes.js";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";

// Suporte para importar arquivos JSON usando ESModules
const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger-output.json");

dotenv.config();
const app = express();

// Comunicação entre o front-end e o back-end usar JSON
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  }),
);

// Obrigatório que o Swagger deva vir antes das rotas
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1/tarefas", tarefaRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
