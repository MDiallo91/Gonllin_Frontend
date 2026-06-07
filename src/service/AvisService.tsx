import axios, { AxiosError } from "axios";
import type { AvisTypeForm, PaginationMeta } from "../types/FormType";

const BASE_URL = import.meta.env.VITE_API_URL;

export default class AvisService {
    static async create(avis: {
        auteur: string; destinataire: string; projet: string;
        noteGlobale: number; criteres?: any; commentaire?: string;
    }): Promise<any> {
        try {
            const response = await axios.post(`${BASE_URL}/api/avis`, avis, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async getAvisByUser(userId: string, page = 1): Promise<{ avis: AvisTypeForm[] } & PaginationMeta> {
        try {
            const response = await axios.get(`${BASE_URL}/api/avis/user/${userId}`, { params: { page }, withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async repondre(avisId: string, reponse: string): Promise<any> {
        try {
            const response = await axios.put(`${BASE_URL}/api/avis/${avisId}/repondre`, { reponse }, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }
}
