import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "https://academialetrastm.com.br/admin/wp-json/headless/v1",
  headers: {
    "Content-Type": "application/json"
  }
})