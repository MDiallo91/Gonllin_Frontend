import axios, { AxiosError } from "axios";
import type { confirmFormType, LoginFormType, RegisterFormType } from "../types/FormType";

const BASE_URL = import.meta.env.VITE_API_URL;

export default class UserService {
  //login
  static async login(
    user: LoginFormType
  ): Promise<{ data: any; token: string; message: string; status: number }> {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/login`,
        user,
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
      console.error("Erreur login:", err.response?.data || err.message);
      throw err;
    }
  }

  //Confirmation de email
  static async confirm(
    user: confirmFormType
  ): Promise<{ data: any; token: string; message: string; status: number }> {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/login`,
        user,
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
      console.error("Erreur login:", err.response?.data || err.message);
      throw err;
    }
  }
//enregistrement
  static async register(user: RegisterFormType ): Promise<{ data: any; token: string; message: string; status: number }> {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/register`,
        user,
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

  // méthode pour récupérer l’utilisateur connecté
  static async fetchUser(): Promise<any | null> {
    try {
      const res = await axios.get(`${BASE_URL}/jwtid`, {
        withCredentials: true,
      });

      if (res.data && res.data.user) {
        console.log("les data de user connecter", res.data)
        return res.data.user;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l’utilisateur :", error);
      return null;
    }
  }
}
