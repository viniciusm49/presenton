import type { ChatStreamTrace } from "../../../services/api/chat";
import type { AssistantActivity } from "./chat-types";

const TOOL_LABELS: Record<string, string> = {
  addOutline: "Adicionador de tópicos",
  updateOutline: "Editor de tópicos",
  deleteOutline: "Removedor de tópicos",
  addNewSlide: "Adicionador de slide em branco",
  addNewSlideLayout: "Adicionador de layout de slide",
  getAvailableLayouts: "Buscador de layouts",
  getTemplateSummary: "Leitor de modelos",
  readSourceDocuments: "Leitor de documentos de origem",
  searchSlide: "Buscador de slides",
  getSlideAtIndex: "Leitor de slide",
  saveSlide: "Salvador de slide",
  updateSlide: "Atualizador de slide",
  deleteSlide: "Removedor de slide",
  addElement: "Adicionador de elemento",
  updateElement: "Atualizador de elemento",
  deleteElement: "Removedor de elemento",
  addComponent: "Adicionador de componente",
  createComponent: "Criador de componente",
  updateComponent: "Atualizador de componente",
  deleteComponent: "Removedor de componente",
  getPresentationTheme: "Leitor de tema",
  setPresentationTheme: "Aplicador de tema",
  generateAssets: "Gerador de recursos",
};

export const MUTATING_TOOLS = new Set([
  "addOutline",
  "updateOutline",
  "deleteOutline",
  "addNewSlide",
  "addNewSlideLayout",
  "saveSlide",
  "updateSlide",
  "deleteSlide",
  "addElement",
  "updateElement",
  "deleteElement",
  "addComponent",
  "createComponent",
  "updateComponent",
  "deleteComponent",
  "setPresentationTheme",
]);

// Read/open traces can happen ahead of edits and would make follow mode jumpy.
export const SLIDE_FOCUS_TOOLS = new Set([
  "addNewSlide",
  "addNewSlideLayout",
  "saveSlide",
  "updateSlide",
  "deleteSlide",
  "addElement",
  "updateElement",
  "deleteElement",
  "addComponent",
  "createComponent",
  "updateComponent",
  "deleteComponent",
]);

export const SLIDE_FOCUS_STATUSES = new Set(["start"]);
export const MIN_SLIDE_FOCUS_DWELL_MS = 700;

const getToolLabel = (tool?: string) => {
  if (!tool) return "";
  return TOOL_LABELS[tool] ?? tool;
};

const humanizeTraceMessage = (message: string, tool?: string) => {
  const trimmed = message.trim();
  if (!trimmed) return "";

  const lower = trimmed.toLowerCase();
  const exactMessages: Record<string, string> = {
    "reading deck context": "Revisando o contexto da sua apresentação.",
    "reading the presentation outline": "Lendo os tópicos da apresentação.",
    "reading the outline draft": "Lendo o rascunho dos tópicos.",
    "adding an outline slide": "Adicionando um slide aos tópicos.",
    "updating the outline slide": "Atualizando o slide dos tópicos.",
    "deleting the outline slide": "Excluindo o slide dos tópicos.",
    "reordering outline slides": "Reordenando os slides dos tópicos.",
    "searching relevant slides": "Buscando slides com conteúdo relevante.",
    "opening the requested slide": "Abrindo o slide selecionado.",
    "checking available themes": "Verificando temas de cores disponíveis.",
    "checking available layouts": "Verificando layouts disponíveis.",
    "checking the layout schema": "Validando o esquema do slide.",
    "generating slide assets": "Gerando imagens e ícones.",
    "saving the slide": "Salvando atualizações do slide.",
    "deleting the slide": "Excluindo o slide.",
    "applying presentation theme": "Aplicando o tema selecionado.",
    "reading template structure": "Lendo a estrutura do modelo.",
    "reading source documents": "Lendo os documentos de origem.",
    "opening the requested template slide": "Abrindo o slide do modelo selecionado.",
    "searching template content": "Buscando conteúdo no modelo.",
    "finding editable elements": "Localizando elementos editáveis.",
    "updating template content": "Atualizando conteúdo do modelo.",
    "deleting the template component": "Excluindo o componente selecionado.",
    "swapping component variant": "Alterando a variante do componente.",
  };
  if (exactMessages[lower]) return exactMessages[lower];

  if (lower.startsWith("using tools:")) {
    const toolNames = trimmed
      .slice("using tools:".length)
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => getToolLabel(entry));
    return toolNames.length === 0
      ? "Planejando o próximo passo."
      : "Escolhendo a melhor forma de ajudar.";
  }
  if (lower.includes("found requested data")) {
    return tool === "getSlideAtIndex"
      ? "Detalhes do slide solicitados encontrados."
      : "Informações solicitadas encontradas.";
  }
  return trimmed;
};

export const inferStatusState = (
  status: string,
): AssistantActivity["state"] => {
  const normalized = status.trim().toLowerCase();
  if (
    [
      "preparing",
      "thinking",
      "reading",
      "searching",
      "opening",
      "generating",
      "processing",
      "finalizing",
      "saving",
    ].some((term) => normalized.includes(term))
  ) {
    return "running";
  }
  return "info";
};

export const isAbortError = (error: unknown) =>
  (error instanceof DOMException && error.name === "AbortError") ||
  (error instanceof Error &&
    error.message.toLowerCase().includes("aborted") &&
    error.message.toLowerCase().includes("request"));

export const stripBackendContextFromUserMessage = (rawMessage: string) => {
  const message = rawMessage ?? "";
  if (!message.startsWith("UI context:")) return message;

  const marker = "\nUser message:";
  const markerIndex = message.indexOf(marker);
  if (markerIndex === -1) return message;
  return message.slice(markerIndex + marker.length).trimStart();
};

const humanActivityForTool = (
  tool: string | undefined,
  state: "start" | "success",
) => {
  const isDone = state === "success";
  switch (tool) {
    case "searchSlide":
      return isDone
        ? "Conteúdo relevante encontrado."
        : "Procurando no conteúdo.";
    case "getSlideAtIndex":
      return isDone ? "Slide verificado." : "Verificando o slide.";
    case "addNewSlide":
    case "addNewSlideLayout":
    case "updateElement":
    case "updateComponent":
    case "addElement":
    case "addComponent":
    case "createComponent":
    case "updateSlide":
    case "saveSlide":
      return isDone ? "Alteração aplicada." : "Aplicando a alteração.";
    case "deleteComponent":
    case "deleteElement":
    case "deleteSlide":
      return isDone
        ? "Item selecionado removido."
        : "Removendo o item selecionado.";
    case "generateAssets":
      return isDone
        ? "Recursos visuais preparados."
        : "Preparando recursos visuais.";
    case "setPresentationTheme":
      return isDone ? "Tema atualizado." : "Atualizando o tema.";
    default:
      return isDone ? "Etapa concluída." : "Trabalhando nisso.";
  }
};

export const formatTraceActivity = (
  trace: ChatStreamTrace,
): Omit<AssistantActivity, "id"> | null => {
  if (typeof trace.message === "string" && trace.message.trim().length > 0) {
    return {
      label: humanizeTraceMessage(trace.message, trace.tool),
      kind: trace.kind,
      round: trace.round,
      tool: trace.tool,
      state:
        trace.status === "error"
          ? "error"
          : trace.status === "success"
            ? "success"
            : trace.status === "ready" || trace.status === "info"
              ? "info"
              : "running",
    };
  }
  if (trace.tool && trace.status === "start") {
    return {
      label: humanActivityForTool(trace.tool, "start"),
      kind: trace.kind,
      round: trace.round,
      tool: trace.tool,
      state: "running",
    };
  }
  if (trace.tool && trace.status === "success") {
    return {
      label: humanActivityForTool(trace.tool, "success"),
      kind: trace.kind,
      round: trace.round,
      tool: trace.tool,
      state: "success",
    };
  }
  if (trace.tool && trace.status === "error") {
    return {
      label: "Não foi possível concluir esta etapa.",
      kind: trace.kind,
      round: trace.round,
      tool: trace.tool,
      state: "error",
    };
  }
  if (trace.kind === "tool_plan" && Array.isArray(trace.tools) && trace.tools.length) {
    return {
      label: "Planejando o próximo passo.",
      kind: trace.kind,
      round: trace.round,
      state: "info",
    };
  }
  return null;
};

export const readTraceSlideIndex = (trace: ChatStreamTrace) => {
  if (typeof trace.slideIndex === "number" && trace.slideIndex >= 0) {
    return trace.slideIndex;
  }
  if (typeof trace.slideNumber === "number" && trace.slideNumber > 0) {
    return trace.slideNumber - 1;
  }
  return null;
};
