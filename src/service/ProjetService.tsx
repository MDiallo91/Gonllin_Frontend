import axios, { AxiosError } from "axios";
import type { ProjetTypeForm } from "../types/FormType";

const BASE_URL = import.meta.env.VITE_API_URL;

export default class ProjetService {

//enregistrement
  static async register(projet:ProjetTypeForm): Promise<{ data: any; token: string; message: string; status: number }> {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/projet/register`,projet,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data; 
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erreur register:", err.response?.data || err.message);
    throw err;
  }
}

static async getProjets(secteurId:any): Promise<{ data: ProjetTypeForm[]; message: string; status: number }> {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/projet/getProjetBySecteur/${secteurId}`,

      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
     const data = response.data;
     console.log("dataForm",data)
      return {
        
        message: data.message,
        status: data.status,
        data: data,
      };
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erreur register:", err.response?.data || err.message);
    throw err;
  }
}

  
}
