import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarTarefa } from "../api";

export default function TodoForm() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const [tarefa, setTarefa] = useState({
    titulo: "",
    data_limite: "",
    descricao: "",
    situacao: "Pendente",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await criarTarefa(tarefa);

      navigate(-1);
    } catch (error) {
      alert(`Erro ao criar tarefa: ${error.message || error}`);
      // navigate("/");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm">Título</label>
        <input
          required
          value={tarefa.titulo}
          onChange={(e) =>
            setTarefa((prev) => ({
              ...prev,
              titulo: e.target.value,
            }))
          }
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm">Descrição</label>
        <textarea
          required
          value={tarefa.descricao}
          onChange={(e) =>
            setTarefa((prev) => ({
              ...prev,
              descricao: e.target.value,
            }))
          }
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm">Data Limite</label>
        <input
          required
          type="date"
          value={tarefa.data_limite}
          onChange={(e) =>
            setTarefa((prev) => ({
              ...prev,
              data_limite: e.target.value,
            }))
          }
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700 duration-200"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-300 duration-200"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
