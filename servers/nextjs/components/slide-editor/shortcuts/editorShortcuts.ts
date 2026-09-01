export type EditorShortcutKey =
  | "Mod"
  | "Shift"
  | "Alt"
  | "Click"
  | "Backspace"
  | "Delete"
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp"
  | "ArrowDown"
  | "C"
  | "G"
  | "J"
  | "K"
  | "V"
  | "Y"
  | "Z"
  | "?";

export type EditorShortcut = {
  id:
    | "multi-select"
    | "group"
    | "delete"
    | "copy"
    | "paste"
    | "undo"
    | "redo"
    | "bring-forward"
    | "bring-to-front"
    | "send-backward"
    | "send-to-back"
    | "previous-slide"
    | "next-slide"
    | "shortcut-help";
  label: string;
  description: string;
  chords: EditorShortcutKey[][];
};

export type EditorShortcutSection = {
  id: "selection" | "editing" | "arrange" | "navigation" | "help";
  title: string;
  description: string;
  shortcuts: EditorShortcut[];
};

const ARROW_KEY_LABELS: Partial<Record<EditorShortcutKey, string>> = {
  ArrowLeft: "←",
  ArrowRight: "→",
  ArrowUp: "↑",
  ArrowDown: "↓",
};

export const EDITOR_SHORTCUT_SECTIONS: EditorShortcutSection[] = [
  {
    id: "selection",
    title: "Seleção",
    description: "Selecione e organize objetos no slide ativo.",
    shortcuts: [
      {
        id: "multi-select",
        label: "Adicionar à seleção",
        description: "Mantenha Shift pressionado ao clicar para adicionar ou remover um objeto.",
        chords: [["Shift", "Click"]],
      },
      {
        id: "group",
        label: "Agrupar objetos",
        description: "Combine dois ou mais objetos selecionados em um grupo.",
        chords: [["Mod", "G"]],
      },
      {
        id: "delete",
        label: "Excluir seleção",
        description: "Remova o(s) objeto(s) selecionado(s) do slide.",
        chords: [["Backspace"], ["Delete"]],
      },
    ],
  },
  {
    id: "editing",
    title: "Edição",
    description: "Comandos comuns de edição para objetos do slide.",
    shortcuts: [
      {
        id: "undo",
        label: "Desfazer",
        description: "Desfaz a última alteração feita no slide ativo.",
        chords: [["Mod", "Z"]],
      },
      {
        id: "redo",
        label: "Refazer",
        description: "Restaura a alteração desfeita mais recente.",
        chords: [["Mod", "Shift", "Z"], ["Mod", "Y"]],
      },
      {
        id: "copy",
        label: "Copiar seleção",
        description: "Copia o(s) objeto(s) selecionado(s).",
        chords: [["Mod", "C"]],
      },
      {
        id: "paste",
        label: "Colar",
        description: "Cola os objetos copiados com um pequeno deslocamento.",
        chords: [["Mod", "V"]],
      },
    ],
  },
  {
    id: "arrange",
    title: "Organizar",
    description: "Altere a camada dos objetos selecionados.",
    shortcuts: [
      {
        id: "bring-forward",
        label: "Trazer para frente",
        description: "Move o objeto selecionado uma camada para frente.",
        chords: [["Alt", "K"]],
      },
      {
        id: "bring-to-front",
        label: "Trazer para o primeiro plano",
        description: "Move o objeto selecionado para a camada mais alta.",
        chords: [["Shift", "Alt", "K"]],
      },
      {
        id: "send-backward",
        label: "Enviar para trás",
        description: "Move o objeto selecionado uma camada para trás.",
        chords: [["Alt", "J"]],
      },
      {
        id: "send-to-back",
        label: "Enviar para o fundo",
        description: "Move o objeto selecionado para a camada mais baixa.",
        chords: [["Shift", "Alt", "J"]],
      },
    ],
  },
  {
    id: "navigation",
    title: "Navegação de slides",
    description: "Navegue entre os slides sem sair da tela de edição.",
    shortcuts: [
      {
        id: "previous-slide",
        label: "Slide anterior",
        description: "Abre o slide anterior ao slide ativo.",
        chords: [["ArrowLeft"], ["ArrowUp"]],
      },
      {
        id: "next-slide",
        label: "Próximo slide",
        description: "Abre o slide seguinte ao slide ativo.",
        chords: [["ArrowRight"], ["ArrowDown"]],
      },
    ],
  },
  {
    id: "help",
    title: "Ajuda",
    description: "Retorne rapidamente a este guia de atalhos.",
    shortcuts: [
      {
        id: "shortcut-help",
        label: "Atalhos de teclado",
        description: "Abre este guia de atalhos do teclado.",
        chords: [["?"]],
      },
    ],
  },
];

export function editorShortcutById(id: EditorShortcut["id"]) {
  return EDITOR_SHORTCUT_SECTIONS.flatMap(
    (section) => section.shortcuts,
  ).find((shortcut) => shortcut.id === id);
}

export function shortcutKeyLabel(
  key: EditorShortcutKey,
  applePlatform: boolean,
) {
  const arrowLabel = ARROW_KEY_LABELS[key];
  if (arrowLabel) return arrowLabel;

  if (!applePlatform) {
    if (key === "Mod") return "Ctrl";
    return key;
  }

  switch (key) {
    case "Mod":
      return "⌘";
    case "Shift":
      return "⇧";
    case "Alt":
      return "⌥";
    case "Backspace":
      return "⌫";
    default:
      return key;
  }
}
