export interface ISocios {
  id: number;
  title: string;
  slug: string;
  link: string;
  socios: {
    nome: string;
    posicao: string;
    eleicao: string;
    nascimento: string;
    falecimento: string;
  }[]
}