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
    return response.data; // <-- directement
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erreur register:", err.response?.data || err.message);
    throw err;
  }
}

  
}
