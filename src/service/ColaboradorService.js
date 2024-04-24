export class ColaboradorService {

    getColaboradores() {
        return fetch('http://localhost:8080/api/colaboradores', {
            headers: { 'Cache-Control': 'no-cache' }
        })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Error fetching colaboradores:', error);
            throw error;
        });
    }


    getValesColaborador(id) {
        return fetch(`http://localhost:8080/api/colaboradores/${id}/vales`, {
            headers: { 'Cache-Control': 'no-cache' }
        })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Error fetching valesColaborador:', error);
            throw error;
        });
    }


    salvarColaborador(colaborador) {
        return fetch('http://localhost:8080/api/colaboradores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(colaborador)
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            throw new Error('Failed to save colaborador.');
        })
        .catch((error) => {
            console.error('Error saving colaborador:', error);
            throw error;
        });
    }


    atualizarColaborador(id, colaborador) {
        return fetch(`http://localhost:8080/api/colaboradores/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(colaborador)
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            throw new Error('Failed to update colaborador.');
        })
        .catch((error) => {
            console.error('Error updating colaborador:', error);
            throw error;
        });
    }


    deletarColaborador(id) {
        return fetch(`http://localhost:8080/api/colaboradores/${id}`, {
            method: 'DELETE',
            headers: {
                'Cache-Control': 'no-cache'
            }
        })
        .then((res) => {
            if (res.ok) {
                return;
            }
            throw new Error('Failed to delete colaborador.');
        })
        .catch((error) => {
            console.error('Error deleting colaborador:', error);
            throw error;
        });
    }
}
