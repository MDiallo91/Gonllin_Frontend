import axios, { AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export default class ConfigService {

  // Récupère la configuration courante de la plateforme
  static async get(): Promise<any> {
    try {
      const res = await axios.get(`${BASE_URL}/api/config`, { withCredentials: true });
      return res.data;
    } catch (error) {
      throw (error as AxiosError);
    }
  }

  // Sauvegarde la configuration (peut être un sous-ensemble de champs)
  static async update(data: any): Promise<any> {
    try {
      const res = await axios.put(`${BASE_URL}/api/config`, data, { withCredentials: true });
      return res.data;
    } catch (error) {
      throw (error as AxiosError);
    }
  }

  // Upload du logo de la plateforme (multipart/form-data)
  static async uploadLogo(file: File): Promise<{ logo: string }> {
    try {
      const form = new FormData();
      form.append("logo", file);
      const res = await axios.put(`${BASE_URL}/api/config/logo`, form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      throw (error as AxiosError);
    }
  }

  // Récupère les audit logs paginés
  static async getAuditLogs(params?: { page?: number; action?: string }): Promise<any> {
    try {
      const res = await axios.get(`${BASE_URL}/api/config/audit-logs`, { params, withCredentials: true });
      return res.data;
    } catch (error) {
      throw (error as AxiosError);
    }
  }
}
