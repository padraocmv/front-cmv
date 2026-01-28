/**
 * Função para formatar uma string para o padrão CPF.
 * @param {string} cpf - o CPF a ser formatado. Deve ser uma string de tamanho 11 com dígitos numéricos.
 * @returns CPF formatado no formato '123.456.789-01'. Se o CPF não for fornecido ou for inválido, retorna uma string vazia.
 */
export const formatCPF = (cpf) => {
    if (cpf) {
        const cleanedCPF = cpf.replace(/\D/g, '');
        const formattedCPF = cleanedCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        return formattedCPF;
    }
    return '';
};

/**
 * Função para aplicar máscara para ocultar parcialmente um CPF.
 * @param {string} cpf - o CPF a ser mascarado. Deve ser uma string de tamanho 14 com dígitos numéricos.
 * @returns CPF mascardo no formato '123.***.***-01'. Se o CPF não for fornecido ou for inválido, retorna uma string vazia.
 */
export const maskCPF = (cpf) => {
    if (cpf) {
        const cleanedCPF = cpf.replace(/\D/g, '');
        let maskedCPF = cleanedCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.***-$4');

        return maskedCPF;
    }
    return '';
};
