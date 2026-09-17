# 📑 To-Do Node.js e MongoDB

Uma To-Do List com Node.js e MongoDB. Projeto sendo desenvolvido nas aulas de Laboratório de Desenvolvimento Web.

## 🛠️ Tecnologias

- **Node.js**: ambiente de execução do backend, configurado com ES Modules.
- **Express**: criação da API HTTP, definição de middlewares e organização das rotas.
- **MongoDB + Mongoose**: armazenamento das tarefas, usuários e mensagens, com os schemas e modelos em `backend/models`.
- **React**: construção da interface do frontend usando componentes, páginas e Hooks.
- **Vite**: servidor de desenvolvimento e ferramenta de build do frontend.
- **React Router**: navegação entre login, cadastro, recuperação de senha, tarefas e criação de tarefas.
- **Tailwind CSS**: estilização dos componentes com classes utilitárias.
- **Axios**: comunicação do frontend com a API REST, incluindo o envio de cookies de sessão.
- **WebSockets + Socket.IO**: comunicação bidirecional em tempo real no chat das tarefas.
- **Swagger**: documentação e visualização dos endpoints da API em `/docs`.
- **JWT, cookie-parser e CORS**: autenticação, leitura de cookies e controle da comunicação entre frontend e backend.
- **Nodemailer**: envio dos e-mails usados no fluxo de recuperação e redefinição de senha.

## 💡 Funcionalidades

- Criação de tarefas com título, descrição, data limite e situação;
- Listagem das tarefas do usuário;
- Cadastro, login e logout de usuários;
- Recuperação e redefinição de senha por e-mail, implementadas em [email.service.js](backend/services/email.service.js);
- Adição de participantes às tarefas colaborativas;
- Chat em tempo real associado a cada tarefa, usando [TodoChatModal.jsx](frontend/src/components/TodoChatModal.jsx) e [registerChatSocket.js](backend/socket/registerChatSocket.js);
- Preenchimento de uma tarefa por comandos de voz, por meio do Hook [useVoiceRecognition.js](frontend/src/hooks/useVoiceRecognition.js);
- Documentação interativa da API disponível em `http://localhost:5000/docs` quando o backend está em execução.

## 🗂️ Estrutura de Pastas

```
./
├── backend/
│   ├── index.js                         # Inicialização do Express, HTTP e Socket.IO
│   ├── package.json                     # Dependências e scripts do backend
│   ├── swagger.js                       # Geração da documentação Swagger
│   ├── swagger-output.json              # Especificação gerada da API
│   ├── controllers/                     # Regras de negócio das requisições
│   │   ├── chat.controller.js
│   │   ├── tarefa.controller.js
│   │   └── usuario.controller.js
│   ├── db/
│   │   └── conn.js                      # Conexão com o MongoDB
│   ├── middleware/
│   │   └── user.js                      # Middleware de autenticação do usuário
│   ├── models/                          # Schemas e modelos do MongoDB
│   │   ├── mensagem.js
│   │   ├── tarefa.js
│   │   └── usuario.js
│   ├── routes/                          # Rotas HTTP da aplicação
│   │   ├── chat.routes.js
│   │   ├── tarefa.routes.js
│   │   └── usuario.routes.js
│   ├── services/
│   │   └── email.service.js             # Serviço de envio de e-mails
│   └── socket/
│       └── registerChatSocket.js        # Eventos do chat em tempo real
├── frontend/
│   ├── package.json                     # Dependências e scripts do frontend
│   ├── vite.config.js                   # Configuração do Vite
│   ├── index.html                       # Documento HTML principal
│   ├── public/                          # Arquivos públicos
│   └── src/
│       ├── main.jsx                     # Ponto de entrada do React
│       ├── App.jsx                      # Rotas e controle da sessão
│       ├── api.js                       # Funções de acesso à API
│       ├── index.css                    # Estilos globais
│       ├── assets/                      # Imagens e outros recursos
│       ├── components/                  # Componentes reutilizáveis
│       │   ├── TodoChatModal.jsx
│       │   └── TodoItem.jsx
│       ├── hooks/                        # Hooks personalizados
│       │   └── useVoiceRecognition.js
│       └── pages/                        # Telas da aplicação
│           ├── Forgot.jsx
│           ├── LandingPage.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Reset.jsx
│           ├── TodoForm.jsx
│           └── TodoList.jsx
├── .gitignore    # Ignora arquivos e pastas sensíveis
└── README.md     # Sobre o projeto
```

## 🗨️ Socket

O chat usa **Socket.IO**, uma biblioteca que mantém uma conexão bidirecional entre o navegador e o servidor. Diferentemente de uma requisição HTTP comum, o backend pode enviar uma mensagem ao frontend assim que ela for criada, sem que a tela precise fazer uma nova consulta.

### Backend

Em [index.js](backend/index.js), o Express é integrado a um servidor HTTP com `createServer`. O Socket.IO é inicializado nesse mesmo servidor, permitindo que a API REST e os eventos em tempo real usem a mesma aplicação. Cada conexão é registrada por `registerChatSocket`.

Em [registerChatSocket.js](backend/socket/registerChatSocket.js), os eventos são organizados por sala:

- `join_chat`: coloca o usuário na sala `tarefa_<id da tarefa>`;
- `send_message`: encaminha a mensagem ao controller, que salva o registro no MongoDB;
- `leave_chat`: remove o usuário da sala quando o chat é fechado.

Depois de salvar a mensagem, [chat.controller.js](backend/controllers/chat.controller.js) usa `io.to(...).emit("receive_message", ...)` para enviar a mensagem preenchida a todos os participantes daquela tarefa. O histórico anterior continua sendo carregado pela rota HTTP `/chat/getHistory/:tarefaId`.

### Frontend

Em [TodoChatModal.jsx](frontend/src/components/TodoChatModal.jsx), o cliente cria a conexão com `socket.io-client`, entra na sala da tarefa e escuta o evento `receive_message`. Ao enviar o formulário, o frontend emite `send_message`. Ao desmontar o modal, emite `leave_chat` e encerra a conexão para evitar listeners e conexões acumuladas.

## 🪝 Hooks

### Personalizadas

> Função JavaScript que permite "enganchar" recursos React. Encapsula a lógica reutilizável e retorna estado, variáveis ou funções.

Hooks personalizados são funções que começam com `use` e encapsulam lógica reutilizável baseada em Hooks do React. Devem ser chamados no nível superior de um componente ou de outro Hook, preservando as regras de chamada do React.

O projeto possui o Hook [useVoiceRecognition.js](frontend/src/hooks/useVoiceRecognition.js), responsável por concentrar a lógica de preenchimento de tarefas por voz. Ele verifica se o navegador oferece `SpeechRecognition` ou `webkitSpeechRecognition`, configura o idioma `pt-BR`, inicia e interrompe a escuta, guarda a transcrição e expõe o estado de suporte da API. Assim, o componente de formulário pode usar essa lógica sem conhecer os detalhes dos eventos do microfone.

### Array Params useEffect

O segundo parâmetro de `useEffect` é um array de dependências. Ele informa ao React quando o efeito deve ser executado novamente:

- `useEffect(() => { ... }, [])`: executa uma vez após a montagem do componente. No Hook de voz, é usado para criar e configurar a instância do reconhecimento;
- `useEffect(() => { ... }, [mensagens])`: executa na montagem e sempre que `mensagens` muda. No chat, é usado para manter a rolagem no final da lista;
- sem array: executaria após toda renderização, o que pode causar trabalho ou efeitos repetidos desnecessariamente.

As dependências devem conter os valores externos usados pelo efeito quando eles puderem mudar. O array vazio é apropriado apenas quando a configuração não depende de valores que mudam durante a vida do componente.

### useRef

`useRef` cria um objeto persistente cuja propriedade `.current` pode ser alterada sem provocar uma nova renderização. É útil para guardar referências de elementos ou instâncias que precisam sobreviver entre renderizações.

No projeto, ele é usado para:

- guardar a instância do reconhecimento de voz em `recognitionRef.current`, permitindo que as funções de iniciar e parar acessem o mesmo objeto;
- guardar o cliente Socket.IO em `socketRef.current`, mantendo a conexão do chat;
- apontar para o fim da lista em `mensagensEndRef`, permitindo chamar `scrollIntoView` e fazer autoscroll das mensagens.

## 🧩 Expressões Regulares

No [useVoiceRecognition.js](frontend/src/hooks/useVoiceRecognition.js), as expressões regulares identificam a palavra-chave falada e capturam o texto que vem depois dela. Todas usam a flag `i`, que torna a busca indiferente a maiúsculas e minúsculas.

| Expressão         | Uso                  | Exemplo                                                         |
| ----------------- | -------------------- | --------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------- |
| `/(?:título       | titulo)\s+(.+)/i`    | Identifica `título` ou `titulo` e captura o conteúdo do título. | `Título Comprar materiais`                                    |
| `/(?:descrição    | descricao)\s+(.+)/i` | Aceita a palavra com ou sem acento e captura a descrição.       | `Descrição Revisar o relatório`                               |
| `/(?:data         | data limite          | prazo)\s+(.+)/i`                                                | Reconhece os comandos de prazo e captura a expressão de data. | `Prazo amanhã`                                                                         |
| `/(?:participante | participantes        | adicionar                                                       | incluir)\s+(.+)/i`                                            | Reconhece comandos para adicionar ou incluir participantes e captura o nome informado. | `Adicionar Maria` |

Nessas expressões, `(?:...)` agrupa alternativas sem criar um grupo de captura, `\s+` exige um ou mais espaços e `(.+)` captura todo o texto restante. O resultado capturado pode ser usado para atualizar os estados do formulário, como título, descrição, data limite e participantes. A função `interpretarDataVoz` também reconhece datas relativas como `hoje`, `amanhã`, `depois de amanhã` e `daqui a N dias`.
