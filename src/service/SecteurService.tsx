import axios, { AxiosError } from "axios";
import type { SecteurFormType } from "../types/FormType";

const BASE_URL = import.meta.env.VITE_API_URL;

export default class SecteurService {

//enregistrement
  static async get(): Promise<SecteurFormType[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/secteur/getSecteurs`,
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
