import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/",
    headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
    }
});

export class TipoService {

    async getTiposColaboradores() {
        try {
            const response = await api.get('tipos-colaboradores');
            return response.data;
        } catch (error) {
            console.error('Error fetching tiposColaboradores:', error);
            throw error;
        }
    }

    async getTiposChavePix() {
        try {
            const response = await api.get('tipos-chave-pix');
            return response.data;
        } catch (error) {
            console.error('Error fetching tiposChavePix:', error);
            throw error;
        }
    }

    async getTiposVales() {
        try {
            const response = await api.get('tipos-vales');
            return response.data;
        } catch (error) {
            console.error('Error fetching tiposVales:', error);
            throw error;
        }
    }
}
