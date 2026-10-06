import { useEffect, useState } from "react";
import { atualizarSituacao, listarTarefas } from "../api";
import { Link } from "react-router-dom";
import TodoItem from "../components/TodoItem";
import GraficoModal from "../components/GraficoModal";

export default function TodoList({ usuarioLogado }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tarefas, setTarefas] = useState([]);
  const [situacaoFiltro, setSituacaoFiltro] = useState("");
  const [isChartOpen, setIsChartOpen] = useState(false);

  const tarefasFiltradas = situacaoFiltro
    ? tarefas.filter((tarefa) => tarefa.situacao === situacaoFiltro)
    : tarefas;

  useEffect(() => {
    const carregarTarefas = async () => {
      setLoading(true);

      try {
        const response = await listarTarefas();
        setTarefas(response.data.tarefas);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    carregarTarefas();
  }, []);

  const mudarSituacao = async (id, novaSituacao) => {
    try {
      await atualizarSituacao(id, novaSituacao);
      setTarefas((atuais) =>
        atuais.map((tarefa) =>
          tarefa._id === id ? { ...tarefa, situacao: novaSituacao } : tarefa,
        ),
      );
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/new"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded shadow-sm transition-all"
          >
            Nova Tarefa
          </Link>

          <button
            type="button"
            onClick={() => setIsChartOpen(true)}
            className="rounded bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 cursor-pointer transition-all"
          >
            Ver gráfico
          </button>

          <div className="flex items-center gap-4">
            <label>Filtrar por situação:</label>
            <select
              value={situacaoFiltro}
              onChange={(event) => setSituacaoFiltro(event.target.value)}
              aria-label="Filtro de situação"
            >
              <option value="">Todas</option>
              <option value="Pendente">Pendente</option>
              <option value="Concluida">Concluida</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
        </div>
        {loading && <p>Carregando...</p>}
        {error && (
          <p className="text-red-600">
            {error.response?.data?.message || error.message}
          </p>
        )}
        <div className="space-y-3">
          {tarefasFiltradas.length === 0 && !loading ? (
            <p className="text-gray-500">Nenhuma Tarefa encontrada!</p>
          ) : (
            tarefasFiltradas.map((t) => (
              <TodoItem
                key={t._id}
                todo={t}
                usuarioLogado={usuarioLogado}
                onSituacaoChange={mudarSituacao}
              />
            ))
          )}
        </div>
      </div>
      {isChartOpen && (
        <GraficoModal tarefas={tarefas} onClose={() => setIsChartOpen(false)} />
      )}
    </>
  );
}
