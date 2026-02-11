export interface IAcademiaRegionalItem {
  nome: string;
  foto: string;          // url
  informacoes: string;   // HTML (WYSIWYG)
  link: string;
  galeria: string[];     // urls
}

export interface IAcademiasRegionaisPage {
  id: number;
  title: string;
  imagem_topo: string;
  academias: IAcademiaRegionalItem[];
}
