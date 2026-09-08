export default function TodoItem({ todo }) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center 
            sm:justify-between p-3 border rounded hover:shadow-sm"
    >
      <div>
        <div className="font-medium">{todo.titulo}</div>
        <div className="text-sm text-gray-700">{todo.descricao}</div>
        <div className="text-sm">
          <span className="font-medium">Data Limite:</span>{" "}
          {new Date(todo.dataLimite).toLocaleDateString()}
        </div>
        <div className="text-sm">
          <span className="font-medium">Situação:</span> {todo.situacao}
        </div>
      </div>
    </div>
  );
}
