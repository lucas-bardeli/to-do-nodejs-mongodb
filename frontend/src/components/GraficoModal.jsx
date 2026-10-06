import Chart from "react-apexcharts";
import { situacoes } from "../utils/situacao";

export default function GraficoModal({ tarefas, onClose }) {
  const series = situacoes.map(
    (situacao) =>
      tarefas.filter((tarefa) => tarefa.situacao === situacao).length,
  );

  const options = {
    labels: situacoes,
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
    colors: ["#eab308", "#22c55e", "#ef4444"],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="grafico-titulo"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
          <h2 id="grafico-titulo" className="text-lg font-bold text-gray-800">
            Tarefas por situação
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar gráfico"
            className="rounded-lg px-2.5 py-1 text-xl font-bold text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          >
            ✕
          </button>
        </header>

        <div className="p-4">
          {tarefas.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              Não há tarefas para exibir.
            </p>
          ) : (
            <Chart
              options={options}
              series={series}
              type="pie"
              width="100%"
              height={320}
            />
          )}
        </div>
      </section>
    </div>
  );
}
