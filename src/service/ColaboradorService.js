import api from './api';

export class ColaboradorService {
    async getColaboradores() {
        try {
            const response = await api.get('colaboradores');
            return response.data;
        } catch (error) {
            console.error('Error fetching colaboradores:', error);
            throw error;
        }
    }

    async getValesColaborador(id) {
        try {
            const response = await api.get(`colaboradores/${id}/vales`);
            return response.data;
        } catch (error) {
            console.error('Error fetching valesColaborador:', error);
            throw error;
        }
    }

    async salvarColaborador(colaborador) {
        try {
            const response = await api.post('colaboradores', colaborador);
            if (response.status === 200 || response.status === 201) {
                return response.data;
            }
            throw new Error('Failed to save colaborador.');
        } catch (error) {
            console.error('Error saving colaborador:', error);
            throw error;
        }
    }

    async atualizarColaborador(id, colaborador) {
        try {
            const response = await api.put(`colaboradores/${id}`, colaborador);
            if (response.status === 200) {
                return response.data;
            }
            throw new Error('Failed to update colaborador.');
        } catch (error) {
            console.error('Error updating colaborador:', error);
            throw error;
        }
    }

    async deletarColaborador(id) {
        try {
            const response = await api.delete(`colaboradores/${id}`);
            if (response.status === 200) {
                return;
            }
            throw new Error('Failed to delete colaborador.');
        } catch (error) {
            console.error('Error deleting colaborador:', error);
            throw error;
        }
    }
}
