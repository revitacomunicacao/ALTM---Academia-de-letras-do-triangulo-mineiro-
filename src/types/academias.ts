export interface IAcademia {
  nome: string;
  foto: string;
  informacoes: string;
  link: string;
  galeria: string[];
}

export interface IAcademiasRegionais {
  imagem_topo: string;
  academias: IAcademia[];
}
