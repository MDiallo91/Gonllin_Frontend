import axios, { AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export default class AdminService {
    static async getStats(): Promise<any> {
        try {
            const response = await axios.get(`${BASE_URL}/api/admin/stats`, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async getUsers(params?: { role?: string; search?: string; page?: number; isSuspended?: boolean }): Promise<any> {
        try {
            const response = await axios.get(`${BASE_URL}/api/admin/users`, { params, withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async toggleActiverUser(id: string): Promise<any> {
        try {
            const response = await axios.put(`${BASE_URL}/api/admin/users/${id}/activer`, {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async verifierUser(id: string): Promise<any> {
        try {
            const response = await axios.put(`${BASE_URL}/api/admin/users/${id}/verifier`, {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async activerPremium(id: string, activer: boolean): Promise<any> {
        try {
            const response = await axios.put(`${BASE_URL}/api/admin/users/${id}/premium`, { activer }, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async suspendreUser(id: string, suspendre: boolean): Promise<any> {
        try {
            const response = await axios.put(`${BASE_URL}/api/admin/users/${id}/suspendre`, { suspendre }, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async deleteUser(id: string): Promise<any> {
        try {
            const response = await axios.delete(`${BASE_URL}/api/admin/users/${id}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async getProjets(params?: any): Promise<any> {
        try {
            const response = await axios.get(`${BASE_URL}/api/admin/projets`, { params, withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async deleteProjet(id: string): Promise<any> {
        try {
            const response = await axios.delete(`${BASE_URL}/api/admin/projets/${id}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async createSecteur(data: any): Promise<any> {
        try {
            const response = await axios.post(`${BASE_URL}/api/admin/secteurs`, data, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async updateSecteur(id: string, data: any): Promise<any> {
        try {
            const response = await axios.put(`${BASE_URL}/api/admin/secteurs/${id}`, data, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async deleteSecteur(id: string): Promise<any> {
        try {
            const response = await axios.delete(`${BASE_URL}/api/admin/secteurs/${id}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async getAvis(page = 1): Promise<any> {
        try {
            const response = await axios.get(`${BASE_URL}/api/admin/avis`, { params: { page }, withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async masquerAvis(id: string): Promise<any> {
        try {
            const response = await axios.put(`${BASE_URL}/api/admin/avis/${id}/masquer`, {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    // ─── Signalements ─────────────────────────────────────────────
    static async getSignalements(params?: { statut?: string; page?: number }): Promise<any> {
        try {
            const response = await axios.get(`${BASE_URL}/api/signalement`, { params, withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async traiterSignalement(id: string, statut: "traite" | "ignore", noteAdmin?: string): Promise<any> {
        try {
            const response = await axios.put(`${BASE_URL}/api/signalement/${id}/traiter`, { statut, noteAdmin }, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }
}
