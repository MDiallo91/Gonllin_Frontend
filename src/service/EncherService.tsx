import axios, { AxiosError } from "axios";
import type { EncherTypeForm } from "../types/FormType";

const BASE_URL = import.meta.env.VITE_API_URL;


export default class EncherService {
//enregistrement
static async register(encher:EncherTypeForm): Promise<{ data: any; token: string; message: string; status: number }> {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/enchere/register`,encher,
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

  static async update(enchereId:any,userChoisi:any ): Promise<{ data: any; token: string; message: string; status: number }> {
    
    try {
      const response = await axios.put(
        `${BASE_URL}/api/enchere/${enchereId}`,
        userChoisi,
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

  


static async getEncherByUser(userId:any): Promise<{ data: EncherTypeForm[]; message: string; status: number }> {
   try {
    const response = await axios.get(
      `${BASE_URL}/api/enchere/byUser/${userId}`,

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
        data: data.result,
      };
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erreur register:", err.response?.data || err.message);
    throw err;
  }

}


static async getEncherByChoix(userId:any): Promise<{ data: EncherTypeForm[]; message: string; status: number }> {
   try {
    const response = await axios.get(
      `${BASE_URL}/api/enchere/byChoix/${userId}`,

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
        data: data.result,
      };
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erreur register:", err.response?.data || err.message);
    throw err;
  }
}

static async getEncher(): Promise<{ data: EncherTypeForm[]; message: string; status: number }> {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/projet/getProjets`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
     const data = response.data;
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
