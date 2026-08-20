import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const listarTarefas = () => api.get("/tarefas");
export const criarTarefa = (task) => api.post("/tarefas", task);

export default api;
