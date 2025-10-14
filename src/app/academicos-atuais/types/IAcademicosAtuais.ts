export interface IMembros {
  id: number;
  title: string;
  slug: string;
  link: string;
  expert: string;
  foto: string;
  cadeira: string;
  posicao: string;
  data_de_nascimento: string;
  data_de_falecimento: string;
  local_de_falecimento: string;
  naturalidade: string;
  antecedido_por: string;
  sucedido_por: string;
  data_de_posse: string;
  academico_que_o_recebeu: string;
  e_membro_da_academia: "Sim" | "Não";
  biografia: string;
  textos_escolhidos: string;
  bibliografia: string;
  discurso_de_posse: string;
} 