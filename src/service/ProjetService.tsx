import axios, { AxiosError } from "axios";
import type { PaginationMeta, ProjetTypeForm } from "../types/FormType";

const BASE_URL = import.meta.env.VITE_API_URL;

export default class ProjetService {
    static async register(projet: Partial<ProjetTypeForm>): Promise<any> {
        try {
            const response = await axios.post(`${BASE_URL}/api/projet/register`, projet, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async getProjets(params?: { secteur?: string; localite?: string; etat?: string; dateDebut?: string; page?: number; limit?: number }): Promise<{ projets: ProjetTypeForm[] } & PaginationMeta> {
        try {
            const response = await axios.get(`${BASE_URL}/api/projet/getProjets`, { params, withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async getProjetBySecteur(secteurId: string, page = 1): Promise<{ projets: ProjetTypeForm[] } & PaginationMeta> {
        try {
            const response = await axios.get(`${BASE_URL}/api/projet/getProjetBySecteur/${secteurId}`, { params: { page }, withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async getProjetsByUser(userId: string, params?: { etat?: string; page?: number }): Promise<{ projets: ProjetTypeForm[] } & PaginationMeta> {
        try {
            const response = await axios.get(`${BASE_URL}/api/projet/user/${userId}`, { params, withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async getProjetById(id: string): Promise<ProjetTypeForm> {
        try {
            const response = await axios.get(`${BASE_URL}/api/projet/${id}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async update(id: string, data: Partial<ProjetTypeForm>): Promise<any> {
        try {
            const response = await axios.put(`${BASE_URL}/api/projet/${id}`, data, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async cloturer(id: string): Promise<any> {
        try {
            const response = await axios.put(`${BASE_URL}/api/projet/${id}/cloturer`, {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async delete(id: string): Promise<any> {
        try {
            const response = await axios.delete(`${BASE_URL}/api/projet/${id}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }
}
