import TodoChatModal from "./TodoChatModal";

export default function TodoItem({ todo }) {
  return (
    <>
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
            {/*Botão para abrir o modal de Chat */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer ml-auto"
              title="Abrir chat da tarefa"
            >
              <span>💬</span>
              <span>Chat</span>
            </button>
          </div>
        </div>
      </div>
      {isChatOpen && (
        <TodoChatModal
          tarefa={todo}
          usuarioLogado={usuarioLogado}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
  );
}
