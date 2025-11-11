export interface IHistorico {
  id: number;
  title: string;
  description: string;
  subtitulo: string;
  imagem_topo: string;
  galeria_de_fotos: string[];
  galeria_de_foto?: {
    titulo: string;
    foto: string;
  }[];
  memoria_da_altm: {
    titulo: string;
    arquivo: {
      url: string;
    }
  }[]
}