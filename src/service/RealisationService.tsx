import axios, { AxiosError } from "axios";
import type { RealisationTypeForm } from "../types/FormType";

const BASE_URL = import.meta.env.VITE_API_URL;

export default class RealisationService {

//enregistrement
  static async post(realisation: any ): Promise<{ data: any; token: string; message: string; status: number }> {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/realisation/register`,
        realisation,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      const data = response.data;
      return {
        token: data.token,
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

    static async getByUser(id:string ): Promise<{ data: any; }> {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/realisation/realisateur/${id}`,
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      return {
        data: data,
      };
    } catch (error) {
      const err = error as AxiosError;
      console.error("Erreur register:", err.response?.data || err.message);
      throw err;
    }
  }

  
}
