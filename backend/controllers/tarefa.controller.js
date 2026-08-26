import Tarefa from "../models/tarefa.js";

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

  static async listarTarefas(req, res) {
    try {
      const tarefas = await Tarefa.find();
      return res
        .status(200)
        .json({ message: "Tarefas listadas com sucesso.", tarefas });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao listar tarefas.", error });
    }
  }
}
