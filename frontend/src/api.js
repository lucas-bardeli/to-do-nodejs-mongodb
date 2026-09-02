import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const listarTarefas = () => api.get("/tarefas");
export const criarTarefa = (task) => api.post("/tarefas", task);

export const registrarUsuario = (usuario) => api.post("/usuarios", usuario);
export const login = (payload) => api.post("/usuarios/login", payload);
export const logout = () => api.post("/usuarios/logout");
export const resetPassword = (payload) =>
  api.post("/usuarios/resetPassword", payload);
export const forgotPassword = (payload) =>
  api.post("/usuarios/forgotPassword", payload);
export const getProfile = () => api.get("/usuarios/me");

export default api;
