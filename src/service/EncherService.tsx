import axios, { AxiosError } from "axios";
import type { EncherTypeForm, PaginationMeta } from "../types/FormType";

const BASE_URL = import.meta.env.VITE_API_URL;

export default class EncherService {
    static async register(enchere: Partial<EncherTypeForm>): Promise<any> {
        try {
            const response = await axios.post(`${BASE_URL}/api/enchere/register`, enchere, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async update(enchereId: string, data: Partial<EncherTypeForm>): Promise<any> {
        try {
            const response = await axios.put(`${BASE_URL}/api/enchere/${enchereId}`, data, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async accepter(enchereId: string, projetId: string): Promise<any> {
        try {
            const response = await axios.put(`${BASE_URL}/api/enchere/${enchereId}`, { statut: "accepte", projet: projetId }, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async delete(enchereId: string): Promise<any> {
        try {
            const response = await axios.delete(`${BASE_URL}/api/enchere/${enchereId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async getEnchere(): Promise<{ data: EncherTypeForm[] } & PaginationMeta> {
        try {
            const response = await axios.get(`${BASE_URL}/api/enchere/getEnchere`, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async getEncheresParProjet(projetId: string): Promise<{ data: EncherTypeForm[] }> {
        try {
            const response = await axios.get(`${BASE_URL}/api/enchere/byProjet/${projetId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async getMesOffres(userId: string, page = 1): Promise<{ data: EncherTypeForm[] } & PaginationMeta> {
        try {
            const response = await axios.get(`${BASE_URL}/api/enchere/mesOffres/${userId}`, { params: { page }, withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async getEncherByUser(userId: string): Promise<{ data: EncherTypeForm[]; result: EncherTypeForm[] }> {
        try {
            const response = await axios.get(`${BASE_URL}/api/enchere/byUser/${userId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async getEncherByChoix(userId: string): Promise<{ result: EncherTypeForm[] }> {
        try {
            const response = await axios.get(`${BASE_URL}/api/enchere/byChoix/${userId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }
}
