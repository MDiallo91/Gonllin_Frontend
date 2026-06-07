import axios, { AxiosError } from "axios";
import type { SecteurTypeForm } from "../types/FormType";

const BASE_URL = import.meta.env.VITE_API_URL;

export default class SecteurService {

  // Récupère tous les secteurs d'activité (liste publique)
  static async get(): Promise<SecteurTypeForm[]> {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/secteur/getSecteurs`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.error("Erreur getSecteurs:", err.response?.data || err.message);
      throw err;
    }
  }
}
