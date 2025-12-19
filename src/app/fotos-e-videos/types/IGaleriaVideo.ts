export interface IGaleriaVideo {
  id: number
  title: string
  description?: string
  content?: string
  date?: string
  imagem_destacada?: string
  links_dos_videos?: string[] // URLs dos vídeos
}