import { useCallback, useEffect, useRef, useState } from "react";

function interpretarDataVoz(texto) {
  const fala = texto.toLowerCase().trim();
  const hoje = new Date();
  const formatarDataLocal = (data) =>
    `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;

  if (fala.includes("hoje")) {
    return formatarDataLocal(hoje);
  }

  if (fala.includes("depois de amanhã") || fala.includes("depois de amanha")) {
    const depoisAmanha = new Date(hoje);
    depoisAmanha.setDate(depoisAmanha.getDate() + 2);
    return formatarDataLocal(depoisAmanha);
  }

  if (fala.includes("amanhã") || fala.includes("amanha")) {
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    return formatarDataLocal(amanha);
  }

  const matchDias = fala.match(/daqui a (\d+) dias/);
  if (matchDias) {
    const dias = parseInt(matchDias[1], 10);
    const dataFutura = new Date(hoje);
    dataFutura.setDate(dataFutura.getDate() + dias);
    return formatarDataLocal(dataFutura);
  }

  return "";
}

export function useVoiceRecognition() {
  const [textoOuvido, setTextoOuvido] = useState("");
  const [ouvindo, setOuvindo] = useState(false);
  const [suportado] = useState(
    () =>
      typeof window !== "undefined" &&
      Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
  );
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Verifica se a api está disponível no navegador
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        // Microfone ficar contínuo
        recognition.continuous = true;
        // Permitir capturar e processar os trechos parciais enquanto o usuário fala
        recognition.interimResults = true;
        // Confimar o idioma
        recognition.lang = "pt-BR";

        // Evento dispara quando o áudio é processado
        // Convertendo em texto
        recognition.onresult = (event) => {
          const transcricaoFinal = Array.from(event.results)
            .filter((resultado) => resultado.isFinal)
            .map((resultado) => resultado[0].transcript)
            .join(" ")
            .trim();

          if (transcricaoFinal) setTextoOuvido(transcricaoFinal);
        };

        // Evento erro
        recognition.onerror = (event) => {
          console.error("Erro no reconhecimento de voz:", event.error);
          setOuvindo(false);
        };

        // Fim da fala
        recognition.onend = () => {
          setOuvindo(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Inicia ou interrompe a gravação (liga/desliga)
  const iniciarEscuta = () => {
    if (!recognitionRef.current) return;

    if (ouvindo) {
      // Se já estiver ouvindo o click manual encerra a gravação
      recognitionRef.current.stop();
    } else {
      // Limpa texto e inicia e escuta
      setTextoOuvido("");
      setOuvindo(true);
      recognitionRef.current.start();
    }
  };

  // Função para parar a gravação manualmente
  const pararEscuta = () => {
    if (recognitionRef.current && ouvindo) {
      recognitionRef.current.stop();
    }
  };

  // Processar a frase capturada e atualiza o estado correspondente
  // Baseado na palavra-chave
  const processarComandoVoz = useCallback(
    (
      fala,
      setTitulo,
      setDescricao,
      setDataLimite,
      usuarios = [],
      handleCheckboxChange,
    ) => {
      // Expressões regulares
      const regexTitulo = /(?:título|titulo)[,.:;]?\s+(.+)/i;
      const regexDescricao = /(?:descrição|descricao)[,.:;]?\s+(.+)/i;
      const regexData = /(?:data|data limite|prazo)[,.:;]?\s+(.+)/i;
      const regexParticipantes =
        /(?:participante|participantes|adicionar|incluir)[,.:;]?\s+(.+)/i;

      // Match Participante
      const matchParticipante = fala.match(regexParticipantes);
      if (matchParticipante && matchParticipante[1] && handleCheckboxChange) {
        const normalizarNome = (nome) =>
          nome
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, " ")
            .replace(/([a-z])\1+/g, "$1")
            .replace(/\s+/g, " ")
            .trim();
        const nomeFalado = normalizarNome(
          matchParticipante[1].trim().replace(/^participantes?\s+/i, ""),
        );
        const usuariosCorrespondentes = usuarios.filter((usuario) =>
          normalizarNome(usuario.nome || "").startsWith(`${nomeFalado} `),
        );
        const usuarioEncontrado =
          usuarios.find(
            (usuario) => normalizarNome(usuario.nome || "") === nomeFalado,
          ) ||
          (usuariosCorrespondentes.length === 1
            ? usuariosCorrespondentes[0]
            : null);
        if (usuarioEncontrado) {
          const id = usuarioEncontrado._id || usuarioEncontrado.id;
          if (id) handleCheckboxChange(id);
        } else {
          console.warn("Usuário não encontrado na lista:", nomeFalado);
        }
        return;
      }

      // Comando do Título
      const matchTitulo = fala.match(regexTitulo);
      if (matchTitulo && matchTitulo[1]) {
        setTitulo(matchTitulo[1].trim());
        return;
      }

      // Comando da Descrição
      const matchDescricao = fala.match(regexDescricao);
      if (matchDescricao && matchDescricao[1]) {
        setDescricao(matchDescricao[1].trim());
        return;
      }

      // Comando da Data
      const matchData = fala.match(regexData);
      if (matchData && matchData[1]) {
        const dataFormatada = interpretarDataVoz(matchData[1]);
        if (dataFormatada) {
          setDataLimite(dataFormatada);
        }
        return;
      }

      // Não deu nenhum match
    },
    [],
  );

  return {
    textoOuvido,
    setTextoOuvido,
    ouvindo,
    iniciarEscuta,
    pararEscuta,
    processarComandoVoz,
    suportado,
  };
}
