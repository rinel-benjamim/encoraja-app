export interface Card {
  id: string
  userId?: string // Opcional para cartões criados por convidados (se implementado local storage depois)
  author: string
  message: string
  backgroundUrl?: string
  backgroundColor?: string
  fontFamily: string
  textColor: string
  createdAt: number // Timestamp
  views: number
  parentId?: string // Para corrente de cartões
  isPublic: boolean
}

export interface CardTemplate {
  id: string
  name: string
  backgroundUrl?: string
  backgroundColor?: string
  defaultMessage?: string
}

export const FONT_OPTIONS = [
  { label: "Serifa Elegante", value: "font-serif" },
  { label: "Sans Moderna", value: "font-sans" },
  { label: "Manuscrita", value: "font-mono" }, // Usando mono como placeholder ou configurar fonte custom
]

export const COLOR_OPTIONS = [
  { label: "Preto", value: "#000000" },
  { label: "Branco", value: "#ffffff" },
  { label: "Azul Escuro", value: "#1e3a8a" },
  { label: "Laranja", value: "#c2410c" },
  { label: "Verde Floresta", value: "#14532d" },
]
