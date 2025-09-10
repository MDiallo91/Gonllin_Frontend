import axios, { AxiosError } from "axios";
import type { ClientFormType } from "../types/FormType";

const BASE_URL = import.meta.env.VITE_API_URL;

export default class ClientService {

//enregistrement
  static async update(id:string, client: ClientFormType ): Promise<{ data: any; token: string; message: string; status: number }> {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/client/${id}`,
        client,
        {
          headers: { "Content-Type": "application/json" },
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

  
}
