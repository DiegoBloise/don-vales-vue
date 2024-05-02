import api from "./api";

export class ValeService {

    async getVales() {
        try {
            const response = await api.get('vales');
            return response.data;
        } catch (error) {
            console.error('Error fetching vales:', error);
            throw error;
        }
    }

    async salvarVale(vale) {
        try {
            const response = await api.post('vales', vale);
            if (response.status === 200 || response.status === 201) {
                return response.data;
            }
            throw new Error('Failed to save vale.');
        } catch (error) {
            console.error('Error saving vale:', error);
            throw error;
        }
    }

    async atualizarVale(id, vale) {
        try {
            const response = await api.put(`vales/${id}`, vale);
            if (response.status === 200) {
                return response.data;
            }
            throw new Error('Failed to update vale.');
        } catch (error) {
            console.error('Error updating vale:', error);
            throw error;
        }
    }

    async deletarVale(id) {
        try {
            const response = await api.delete(`vales/${id}`);
            if (response.status === 200) {
                return;
            }
            throw new Error('Failed to delete vale.');
        } catch (error) {
            console.error('Error deleting vale:', error);
            throw error;
        }
    }
}
