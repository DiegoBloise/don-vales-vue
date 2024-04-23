export class ColaboradorService {
    getColaboradores() {
        return fetch('http://localhost:8080/api/colaboradores', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    }

    getTiposColaboradores() {
        return fetch('http://localhost:8080/api/tipos-colaboradores', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    }

    getTiposChavePix() {
        return fetch('http://localhost:8080/api/tipos-chave-pix', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    }
}
