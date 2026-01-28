import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil';
import MenuMobile from '../../components/menu-mobile';
import Estoque from '../../assets/png/estoque.png';
import Produtos from '../../assets/png/produtos.png';
import Dinheiro from '../../assets/png/dinheiro.png';
import Compra from '../../assets/png/compra.png';
import CustomTooltip from '../../components/grafico';
import CustomToast from '../../components/toast';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { formatValor } from '../../utils/functions';
import { useUnidade } from '../../components/unidade-context';
import moment from 'moment';

const Dashboard = () => {
    const tipoUsuario = localStorage.getItem('tipo');
    const navigate = useNavigate();
    const { unidadeId } = useUnidade();
    const [totalProdutos, setTotalProdutos] = useState(0);
    const [itensEmEstoque, setItensEmEstoque] = useState(0);
    const [valorTotal, setValorTotal] = useState(0);
    const [cmv, setCmv] = useState(0);
    const [produtosAbaixoMinimo, setProdutosAbaixoMinimo] = useState(0);
    const [estoquePorCategoria, setEstoquePorCategoria] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [entradasSaidasOriginais, setEntradasSaidasOriginais] = useState([]);
    const [entradasSaidas, setEntradasSaidas] = useState([]);
    const [dataGrafico, setDataGrafico] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [produtosOriginais, setProdutosOriginais] = useState([]);
    const userOptionsUnidade = [
        { value: 1, label: 'Kilograma' },
        { value: 2, label: 'Grama' },
        { value: 3, label: 'Litro' },
        { value: 4, label: 'Mililitro' },
        { value: 5, label: 'Unidade' },
    ];

    const isUsuarioTipo3 = tipoUsuario === "3";
    
    const prepareDataForChart = (movimentacoes) => {
        const dataMap = {};

        movimentacoes.forEach(mov => {
            const produtoNome = mov.produtoNome;

            if (!dataMap[produtoNome]) {
                dataMap[produtoNome] = {
                    nome: produtoNome,
                    entradas: 0,
                    saidas: 0,
                    desperdicio: 0,
                };
            }

            if (mov.tipo === "1") {
                dataMap[produtoNome].entradas += mov.quantidade;
            } else if (mov.tipo === "2") {
                dataMap[produtoNome].saidas += mov.quantidade;
            } else if (mov.tipo === "3") {
                dataMap[produtoNome].desperdicio += mov.quantidade;
            }
        });

        return Object.values(dataMap);
    };

    const getColor = (index) => {
        const colors = [
            '#BCDA72', '#FF8042', '#006b33', '#FFBB28', '#FF4444',
            '#8A2BE2', '#00CED1', '#FFD700', '#ADFF2F', '#FF69B4'
        ];
        return colors[index % colors.length];
    };

    const carregaProdutos = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/produto?unidadeId=${unidadeId}`);


            if (Array.isArray(response.data.data)) {
                const produtosFiltrados = response.data.data.filter(produto => produto.unidadeId === unidadeId);

                const mappedProdutos = produtosFiltrados.map(produto => {
                    const unidade = userOptionsUnidade.find(unit => unit.value === parseInt(produto.unidadeMedida));
                    const valorFormatado = formatValor(produto.valorReajuste || produto.valor);

                    return {
                        id: produto.id,
                        nome: produto.nome,
                        rendimento: produto.rendimento,
                        unidadeMedida: unidade ? unidade.label : 'N/A',
                        categoria: produto.categoriaNome,
                        valorPorcao: formatValor(produto.valorPorcao),
                        valor: formatValor(produto.valorReajuste || produto.valor),
                        valorFormatado: valorFormatado,
                        qtdMin: produto.qtdMin,
                        categoriaId: produto.categoriaId,
                        createdAt: new Date(produto.createdAt).toLocaleDateString('pt-BR'),
                        categoriaNome: produto.categoriaNome
                    };
                });

                setProdutos(mappedProdutos);
                setProdutosOriginais(mappedProdutos);
            } else {
                setProdutos([]);
                setProdutosOriginais([]);
            }
        } catch (error) {

            if (error.response && error.response.data.message === "Credenciais inválidas" && error.response.data.data === "Token de acesso inválido") {
                CustomToast({ type: "error", message: "Sessão expirada. Faça login novamente." });
                navigate("/");
            } else {
                CustomToast({ type: "error", message: "Erro ao carregar produtos!" });
            }
        } finally {
            setLoading(false);
        }
    };


    const fetchDashboardData = async () => {
        try {
            const response = await api.post(`/dashboard?unidade=${unidadeId}`);
            if (response.data.status) {
                setTotalProdutos(response.data.data.totalProduto);
                setItensEmEstoque(response.data.data.totalItens);
                setValorTotal(Number(response.data.data.valorTotalItens) || 0);
                setProdutosAbaixoMinimo(response.data.data.produtosQtdMin);
                setProdutos(response.data.data.produtos || []);
                setEntradasSaidas(response.data.data.entradasSaidas || []);
            } else {
                CustomToast({ type: "error", message: response.data.message || "Erro ao carregar os dados!" });
            }
        } catch (err) {
            CustomToast({ type: "error", message: "Erro ao carregar os dados!" });
            if (err.response) {
                if (err.response.data.message === "Credenciais inválidas" && err.response.data.data === "Token de acesso inválido") {
                    CustomToast({ type: "error", message: "Sessão expirada. Faça login novamente." });
                    navigate("/");
                } else {
                    CustomToast({ type: "error", message: err.response.data.message || "Erro ao carregar as unidades!" });
                }
            }
        }
    };

    const fetchEntradasSaidas = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/movimentacao?unidade=${unidadeId}`);
            const movimentacoes = response.data.data;

            const formattedMovimentacoes = movimentacoes.map(mov => {
                return {
                    id: mov.id,
                    tipo: mov.tipo,
                    produtoNome: mov.produtoNome,
                    quantidade: mov.quantidade,
                    categoria: mov.categoriaNome,
                    precoPorcao: mov.precoPorcao,
                    valorTotal: mov.precoPorcao * mov.quantidade,
                    observacao: mov.observacao,
                    dataCadastro: moment(mov.data).format('DD/MM/YYYY'),
                    dataISO: mov.data
                };
            });

            setEntradasSaidas(formattedMovimentacoes);
            setEntradasSaidasOriginais(formattedMovimentacoes);
            const dataGrafico = prepareDataForChart(formattedMovimentacoes);
            setDataGrafico(dataGrafico);
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao carregar as movimentações!" });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchEntradasSaidas();
    }, [unidadeId]);

    useEffect(() => {
        const data = produtos.map(produto => {
            const entradas = entradasSaidas.filter(item => item.produto === produto.nome && item.tipo === 'entrada').reduce((acc, item) => acc + parseInt(item.quantidade), 0);
            const saidas = entradasSaidas.filter(item => item.produto === produto.nome && item.tipo === 'saida').reduce((acc, item) => acc + parseInt(item.quantidade), 0);
            const desperdicio = entradasSaidas.filter(item => item.produto === produto.nome && item.tipo === 'desperdicio').reduce((acc, item) => acc + parseInt(item.quantidade), 0);

            return {
                nome: produto.nome,
                entradas,
                saidas,
                desperdicio
            };
        });

        setDataGrafico(data);
    }, [produtos, entradasSaidas]);

    useEffect(() => {
        const categoriasContagem = produtos.reduce((acc, produto) => {
            const categoria = produto.categoriaNome || 'Sem Categoria';

            if (!acc[categoria]) {
                acc[categoria] = 0;
            }

            acc[categoria] += 1;
            return acc;
        }, {});

        const categoriasData = Object.keys(categoriasContagem).map(categoria => ({
            name: categoria,
            quantidade: categoriasContagem[categoria],
        }));

        setEstoquePorCategoria(categoriasData);
    }, [produtos]);

    useEffect(() => {
        const data = produtos.map(produto => {
            const entradas = entradasSaidas
                .filter(item => item.produtoNome === produto.nome && item.tipo === '1')
                .reduce((acc, item) => acc + parseInt(item.quantidade), 0);

            const saidas = entradasSaidas
                .filter(item => item.produtoNome === produto.nome && item.tipo === '2')
                .reduce((acc, item) => acc + parseInt(item.quantidade), 0);

            const desperdicio = entradasSaidas
                .filter(item => item.produtoNome === produto.nome && item.tipo === '3')
                .reduce((acc, item) => acc + parseInt(item.quantidade), 0);

            return {
                nome: produto.nome,
                entradas,
                saidas,
                desperdicio
            };
        });

        setDataGrafico(data);
    }, [produtos, entradasSaidas]);


    useEffect(() => {

        carregaProdutos();
        fetchEntradasSaidas();
    }, []);

    useEffect(() => {
        if (unidadeId) {
            fetchDashboardData();
            carregaProdutos();
        }
    }, [unidadeId]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const movimentacoesContagem = {};
        entradasSaidas.forEach(item => {
            const produtoNome = item.produtoNome;

            if (!movimentacoesContagem[produtoNome]) {
                movimentacoesContagem[produtoNome] = {
                    nome: produtoNome,
                    entradas: 0,
                    saidas: 0,
                    desperdicio: 0,
                };
            }

            if (item.tipo === '1') {
                movimentacoesContagem[produtoNome].entradas += item.quantidade;
            } else if (item.tipo === '2') {
                movimentacoesContagem[produtoNome].saidas += item.quantidade;
            } else if (item.tipo === '3') {
                movimentacoesContagem[produtoNome].desperdicio += item.quantidade;
            }
        });

        const dataArray = Object.values(movimentacoesContagem);
        const sortedData = dataArray.sort((a, b) => {
            const totalA = a.entradas + a.saidas + a.desperdicio;
            const totalB = b.entradas + b.saidas + b.desperdicio;
            return totalB - totalA;
        });


        const top5Data = sortedData.slice(0, 5);

        setDataGrafico(top5Data);
    }, [entradasSaidas]);

    return (
        <div className="lg:flex w-[100%] h-[100%]">
            <MenuMobile />
            <Navbar />
            <div className='flex flex-col gap-2 w-full items-end'>
                <HeaderPerfil />
                <h1 className='flex items-center md:justify-center md:mt-16  lg:mt-0  justify-center mt-6  lg:justify-start ml-3 text-2xl font-bold text-primary w-[95%] lg:w-[98%]'>
                    Dashboard
                </h1>

                <div className={`w-full mt-8 flex-wrap p-3 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                    <div className='w-full flex gap-6 flex-wrap items-center justify-center'>

                        <div className='w-[50%] p-5 border-[2px] rounded-lg md:w-[90%] lg:w-[22%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold'>Total de Produtos</label>
                            <div className='flex items-center justify-center gap-6'>
                                <img src={Estoque} alt="Total de Produtos" />
                                <label className='text-black font-semibold w-full'>{totalProdutos}</label>
                            </div>
                        </div>
                        <div className='w-[50%] p-5 border-[2px] rounded-lg md:w-[43%] lg:w-[22%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold'>Itens em Estoque</label>
                            <div className='flex items-center justify-center gap-6'>
                                <img src={Produtos} alt="Itens em Estoque" />
                                <label className='text-black font-semibold w-full'>{itensEmEstoque}</label>
                            </div>
                        </div>
                        {!isUsuarioTipo3 && (
                            <div className='w-[50%] p-5 border-[2px] rounded-lg md:w-[43%] lg:w-[22%] flex-col gap-2 flex items-center justify-center'>
                                <label className='text-black text-xs font-semibold'>Valor Total</label>
                                <div className='flex items-center justify-center gap-6'>
                                    <img src={Dinheiro} alt="Valor Total" />
                                    <label className='text-black font-semibold w-full'> {formatValor(valorTotal)}</label>
                                </div>
                            </div>
                        )}

                        {!isUsuarioTipo3 && (
                            <div className='w-[50%] p-5 border-[2px] rounded-lg md:w-[43%] lg:w-[22%] flex-col gap-2 flex items-center justify-center'>
                                <label className='text-black text-xs font-semibold'>Itens para comprar</label>
                                <div className='flex items-center justify-center gap-6'>
                                    <img src={Compra} alt="Produtos Abaixo do Mínimo" />
                                    <label className='text-black font-semibold w-full'>{produtosAbaixoMinimo}</label>
                                </div>
                            </div>
                        )}
                    </div>

                    {!isUsuarioTipo3 && (
                        <div className='flex w-full items-end h-[70%] justify-center flex-wrap'>
                            <div className="mt-8 w-[100%] lg:w-[30%] h-64">
                                <h2 className="text-lg text-center font-bold text-primary mb-7">Estoque por Categoria</h2>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={estoquePorCategoria}
                                            dataKey="quantidade"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            label
                                        >
                                            {estoquePorCategoria.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={getColor(index)} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-8 w-[100%] lg:w-[30%] h-64">
                                <h2 className="text-lg text-center w-full font-bold text-primary mt-12 lg:mt-0 mb-7">Entradas, Saídas e Desperdícios por Produto</h2>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={dataGrafico}>
                                        <XAxis dataKey="nome" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 10 }} />
                                        <Tooltip content={<CustomTooltip />} contentStyle={{ fontSize: 12 }} />
                                        <Bar dataKey="entradas" fill="#BCDA72" />
                                        <Bar dataKey="saidas" fill="#FF0000" />
                                        <Bar dataKey="desperdicio" fill="#000000" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;