export class Util {
    formatMoneyInput(value) {
        var newValue = value.replace(/[^\d]/g, '');

        newValue = newValue.replace(/^0+/, '');

        while (newValue.length < 3) {
            newValue = '0' + newValue;
        }

        var integerPart = newValue.slice(0, -2) || '0';
        var decimalPart = newValue.slice(-2);

        newValue = 'R$ ' + integerPart + ',' + decimalPart;

        return newValue;
    }

    realParaFloat(valorReal) {
        const valorSemSimbolo = valorReal.replace(/[^\d,]/g, '');
        const valorComPonto = valorSemSimbolo.replace(',', '.');
        return parseFloat(valorComPonto);
    }

    floatParaReal(valorFloat) {
        const valorFormatado = parseFloat(valorFloat).toFixed(2);
        const partes = valorFormatado.split('.');
        const parteInteira = partes[0].split('').reverse().reduce((acc, num, i) => {
            return num + (i && i % 3 === 0 ? '.' : '') + acc;
        }, '');
        return 'R$ ' + parteInteira + ',' + partes[1];
    }

    formatData(data) {
        const partes = data.split('-');

        const ano = partes[0];
        const mes = partes[1];
        const dia = partes[2];

        const dataFormatada = `${dia}/${mes}/${ano}`;

        return dataFormatada;
    }

    formatLocalDate(data) {
        const partes = data.split('/');

        const dia = partes[0];
        const mes = partes[1];
        const ano = partes[2];

        const dataFormatada = `${ano}-${mes}-${dia}`;

        return dataFormatada;
    }

    formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    todo() {
        alert("Necessita Implementar...");
    }
}