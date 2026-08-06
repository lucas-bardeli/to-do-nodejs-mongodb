import Tarefa from "../models/tarefa.js";
import { Types } from "mongoose";

export default class TarefaController {
  static async criarTarefa(req, res) {
    const { titulo, descricao, data_limite, situacao } = req.body;

    if (!titulo || !descricao || !data_limite || !situacao) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    try {
      const tarefa = new Tarefa({
        titulo,
        descricao,
        data_limite,
        situacao,
      });
      const novaTarefa = await tarefa.save();
      return res
        .status(200)
        .json({ message: "Tarefa criada com sucesso.", novaTarefa });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar tarefa.", error });
    }
  }
}
