import axios from "axios";

export const axiosClient = axios.create({
  baseURL:"https://revitacomunicacao.com.br/projetos/altm/admin/wp-json/headless/v1",
  headers: {
    "Content-Type": "application/json"
  }
})