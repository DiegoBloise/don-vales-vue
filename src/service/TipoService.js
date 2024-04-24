export class TipoService {

    getTiposColaboradores() {
        return fetch('http://localhost:8080/api/tipos-colaboradores', {
            headers: { 'Cache-Control': 'no-cache' }
        })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Error fetching tiposColaboradores:', error);
            throw error;
        });
    }

    getTiposChavePix() {
        return fetch('http://localhost:8080/api/tipos-chave-pix', {
            headers: { 'Cache-Control': 'no-cache' }
        })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Error fetching tiposChavePix:', error);
            throw error;
        });
    }

    getTiposVales() {
        return fetch('http://localhost:8080/api/tipos-vales', {
            headers: { 'Cache-Control': 'no-cache' }
        })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Error fetching tiposVales:', error);
            throw error;
        });
    }
}