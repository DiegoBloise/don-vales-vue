export class ValeService {

    getVales() {
        return fetch('http://localhost:8080/api/vales', {
            headers: { 'Cache-Control': 'no-cache' }
        })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Error fetching vales:', error);
            throw error;
        });
    }


    salvarVale(vale) {
        return fetch('http://localhost:8080/api/vales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(vale)
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            throw new Error('Failed to save vale.');
        })
        .catch((error) => {
            console.error('Error saving vale:', error);
            throw error;
        });
    }


    atualizarVale(id, vale) {
        return fetch(`http://localhost:8080/api/vales/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(vale)
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            throw new Error('Failed to update vale.');
        })
        .catch((error) => {
            console.error('Error updating vale:', error);
            throw error;
        });
    }


    deletarVale(id) {
        return fetch(`http://localhost:8080/api/vales/${id}`, {
            method: 'DELETE',
            headers: {
                'Cache-Control': 'no-cache'
            }
        })
        .then((res) => {
            if (res.ok) {
                return;
            }
            throw new Error('Failed to delete vale.');
        })
        .catch((error) => {
            console.error('Error deleting vale:', error);
            throw error;
        });
    }
}
