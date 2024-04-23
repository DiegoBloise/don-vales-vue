export class ColaboradorService {
    getColaboradores() {
        return fetch('http://localhost:8080/api/colaboradores', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((data) => data.map((colaborador) => ({
                id: colaborador.id,
                nome: colaborador.nome,
                telefone: colaborador.telefone,
                dataNascimento: new Date(colaborador.dataNascimento),
                tipo: colaborador.tipo,
                pix: colaborador.pix
            })));
    }
}
