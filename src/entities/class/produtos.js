import { produtos } from "../../utils/json/produtos";

export const listaProdutos = produtos.map(produto => ({
    nome: produto.Titular.nome,
    quantidadeMinima: produto.quantidadeMinima,
    unidadeMedida: produto.unidadeMedida,
    rendimento: produto.rendimento,
  }));