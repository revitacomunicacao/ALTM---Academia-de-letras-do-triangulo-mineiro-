export interface IGaleriaItem {
  id: number
  url: string
  title: string
  alt: string
  caption: string
  thumbnail?: string
  type?: "photo" | "video"
}

export interface IGaleria {
  id: number
  title: string
  description?: string
  content?: string
  date?: string
  imagem_destacada?: string
  galeria?: IGaleriaItem[]
  video_url?: string
  video_thumbnail?: string
}

