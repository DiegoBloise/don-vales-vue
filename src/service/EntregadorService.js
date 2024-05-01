import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/",
    headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
    }
});

export class EntregadorService {

    async getEntregadores() {
        try {
            const response = await api.get('entregadores');
            return response.data;
        } catch (error) {
            console.error('Error fetching entregadores:', error);
            throw error;
        }
    }

    async getEntregadoresPorData(inicio, fim) {
        try {
            const response = await api.get(`entregadores/${inicio}/${fim}`);
            if (response.status === 200) {
                return response.data;
            }
            throw new Error('Failed to fetching entregadores.');
        } catch (error) {
            console.error('Error fetching entregadores:', error);
            throw error;
        }
    }

    async getValesEntregador(id) {
        try {
            const response = await api.get(`entregadores/${id}/vales`);
            return response.data;
        } catch (error) {
            console.error('Error fetching valesEntregador:', error);
            throw error;
        }
    }

    async salvarEntregador(entregador) {
        try {
            const response = await api.post('entregadores', entregador);
            if (response.status === 200 || response.status === 201) {
                return response.data;
            }
            throw new Error('Failed to save entregador.');
        } catch (error) {
            console.error('Error saving entregador:', error);
            throw error;
        }
    }

    async atualizarEntregador(id, entregador) {
        try {
            const response = await api.put(`entregadores/${id}`, entregador);
            if (response.status === 200) {
                return response.data;
            }
            throw new Error('Failed to update entregador.');
        } catch (error) {
            console.error('Error updating entregador:', error);
            throw error;
        }
    }

    async deletarEntregador(id) {
        try {
            const response = await api.delete(`entregadores/${id}`);
            if (response.status === 200) {
                return;
            }
            throw new Error('Failed to delete entregador.');
        } catch (error) {
            console.error('Error deleting entregador:', error);
            throw error;
        }
    }
}
