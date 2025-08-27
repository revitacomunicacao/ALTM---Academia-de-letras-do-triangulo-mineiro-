import axios from "axios";

export const axiosClient = axios.create({
  baseURL:"https://companhiadamidia.com.br/desenvolvimento/altm/admin/wp-json/headless/v1",
  headers: {
    "Content-Type": "application/json"
  }
})