export class EntregadorService {

    getEntregadores() {
        return fetch('http://localhost:8080/api/entregadores', {
            headers: { 'Cache-Control': 'no-cache' }
        })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Error fetching entregadores:', error);
            throw error;
        });
    }


    getEntregadoresPorData(inicio, fim) {
        return fetch(`http://localhost:8080/api/entregadores/${inicio}/${fim}`, {
            headers: { 'Cache-Control': 'no-cache' }
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            throw new Error('Failed to fetching entregadores.');
        })
        .catch((error) => {
            console.error('Error fetching entregadores:', error);
            throw error;
        });
    }


    getValesEntregador(id) {
        return fetch(`http://localhost:8080/api/entregadores/${id}/vales`, {
            headers: { 'Cache-Control': 'no-cache' }
        })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Error fetching valesEntregador:', error);
            throw error;
        });
    }


    salvarEntregador(entregador) {
        return fetch('http://localhost:8080/api/entregadores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(entregador)
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            throw new Error('Failed to save entregador.');
        })
        .catch((error) => {
            console.error('Error saving entregador:', error);
            throw error;
        });
    }


    atualizarEntregador(id, entregador) {
        return fetch(`http://localhost:8080/api/entregadores/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(entregador)
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            throw new Error('Failed to update entregador.');
        })
        .catch((error) => {
            console.error('Error updating entregador:', error);
            throw error;
        });
    }


    deletarEntregador(id) {
        return fetch(`http://localhost:8080/api/entregadores/${id}`, {
            method: 'DELETE',
            headers: {
                'Cache-Control': 'no-cache'
            }
        })
        .then((res) => {
            if (res.ok) {
                return;
            }
            throw new Error('Failed to delete entregador.');
        })
        .catch((error) => {
            console.error('Error deleting entregador:', error);
            throw error;
        });
    }
}
