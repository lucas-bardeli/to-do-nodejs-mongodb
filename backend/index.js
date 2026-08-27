import "dotenv/config"; // Tem que ser a primeira linha no index
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
import tarefaRoutes from "./routes/tarefa.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import cookieParser from "cookie-parser";

// Suporte para importar arquivos JSON usando ESModules
const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger-output.json");

const app = express();

// Comunicação entre o front-end e o back-end usar JSON
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  }),
);

// Obrigatório que o Swagger deva vir antes das rotas
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/tarefas", tarefaRoutes);
app.use("/usuarios", usuarioRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
