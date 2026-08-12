import mongoose from "../db/conn.js";

const { Schema } = mongoose;

const tarefaSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    descricao: {
      type: String,
      required: true,
    },
    data_limite: {
      type: Date,
      required: true,
    },
    situacao: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Tarefa = mongoose.model("Tarefa", tarefaSchema);
export default Tarefa;
