import axios, { AxiosError } from "axios";
import type { NotificationTypeForm, PaginationMeta } from "../types/FormType";

const BASE_URL = import.meta.env.VITE_API_URL;

export default class NotificationService {
    static async getMesNotifications(page = 1): Promise<{ notifications: NotificationTypeForm[]; nonLues: number } & PaginationMeta> {
        try {
            const response = await axios.get(`${BASE_URL}/api/notification`, { params: { page }, withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async marquerLue(id: string): Promise<any> {
        try {
            const response = await axios.put(`${BASE_URL}/api/notification/${id}/lue`, {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async marquerToutesLues(): Promise<any> {
        try {
            const response = await axios.put(`${BASE_URL}/api/notification/toutes/lues`, {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }

    static async delete(id: string): Promise<any> {
        try {
            const response = await axios.delete(`${BASE_URL}/api/notification/${id}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw (error as AxiosError);
        }
    }
}
