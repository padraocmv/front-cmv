import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbars/header';
import MenuMobile from '../../components/menu-mobile';
import HeaderPerfil from '../../components/navbars/perfil';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import SelectTextFields from '../../components/select';
import ButtonComponent from '../../components/button';
import { NumericFormat } from 'react-number-format';
import ButtonClose from '../../components/buttons/button-close';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import TabelaProdutos from '../../components/table-expanded';
import CustomToast from '../../components/toast';
import CentralModal from '../../components/modal-central';
import { useUnidade } from '../../components/unidade-context';
import api from '../../services/api';
import TableLoading from '../../components/loading/loading-table/loading';

import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import { AddCircleOutline, Edit, MoneySharp, Save, Search } from '@mui/icons-material';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ArticleIcon from '@mui/icons-material/Article';
import ScaleIcon from '@mui/icons-material/Scale';
import FlatwareIcon from '@mui/icons-material/Flatware';

export const formatValor = (valor) => {
    const parsedValor = parseFloat(valor);
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(parsedValor);
};

export const formatarValorMoeda = (valor) => {
    const parsedValor = parseFloat(valor);
    return `R$ ${parsedValor.toFixed(2).replace('.', ',')}`; 
};
const unidadeMedidaMap = {
    1: 'Kilograma',
    2: 'Grama',
    3: 'Litro',
    4: 'Mililitro',
    5: 'Unidade',
};

const FichaTecnica = () => {
    const { unidadeId } = useUnidade();
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [precoPorcao, setPrecoPorcao] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [nomePrato, setNomePrato] = useState('');
    const [unidade, setUnidade] = useState('');
    const [tipoRendimentoSelecionado, setTipoRendimentoSelecionado] = useState('');
    const [valorUtilizado, setValorUtilizado] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [pratoId, setPratoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [produtosAdicionados, setProdutosAdicionados] = useState([]);
    const [custoTotal, setCustoTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [produtosDaFicha, setProdutosDaFicha] = useState([]);
    const [valorVenda, setValorVenda] = useState('');
    const [lucroReal, setLucroReal] = useState(0);
    const [rendimento, setRendimento] = useState('');
    const [valorRendimento, setValorRendimento] = useState(0);
    const [cmvReal, setCmvReal] = useState(0);
    const [pratoEmEdicao, setPratoEmEdicao] = useState(null);
    const [criarPrato, setCriarPrato] = useState(false);
    const [editar, setEditar] = useState(false);

    const tipoRendimentoOptions = [
        { label: 'Kilograma', value: 'kilograma' },
        { label: 'Grama', value: 'grama' },
        { label: 'Litro', value: 'litro' },
        { label: 'Mililitro', value: 'mililitro' },
        { label: 'Unidade', value: 'unidade' },
    ];



    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredPratos = produtosDaFicha.filter(prato =>
        prato.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (quantidade && precoPorcao) {
            const valor = parseFloat(quantidade) * parseFloat(precoPorcao.replace('R$', '').replace(',', '.'));
            setValorUtilizado(formatValor(valor));
        } else {
            setValorUtilizado('');
        }
    }, [quantidade, precoPorcao]);

    useEffect(() => {
        const total = produtosAdicionados.reduce((acc, produto) => {
            const valor = parseFloat(produto.valorUtilizado.replace('R$', '').replace(',', '.'));
            return acc + (isNaN(valor) ? 0 : valor);
        }, 0);
        setCustoTotal(total);
    }, [produtosAdicionados]);

    useEffect(() => {
        const valorVendaNumerico = parseFloat(valorVenda.replace('R$', '').replace('.', '').replace(',', '.'));
        if (!isNaN(valorVendaNumerico) && custoTotal) {
            const lucro = valorVendaNumerico - custoTotal;
            setLucroReal(lucro);

            if (valorVendaNumerico > 0) {
                const cmvCalculado = (custoTotal / valorVendaNumerico) * 100;
                setCmvReal(cmvCalculado);
            } else {
                setCmvReal(0);
            }
        } else {
            setLucroReal(0);
            setCmvReal(0);
        }
    }, [valorVenda, custoTotal]);


    useEffect(() => {
        if (custoTotal && rendimento) {
            const valorRendimentoCalculado = (custoTotal / parseFloat(rendimento)) * 1000;

            setValorRendimento(valorRendimentoCalculado);
        } else {
            setValorRendimento(0);
        }
    }, [custoTotal, rendimento]);

    const fetchProdutosDaFicha = async () => {
        try {
            const response = await api.get(`/ficha?unidade=${unidadeId}`);
            const data = response.data.data;

            if (Array.isArray(data)) {
                const pratosComProdutos = data.map(prato => ({
                    ...prato,
                    produtos: prato.produtos.map(produto => {
                        const produtoSelecionado = produtos.find(p => p.id === produto.produtoId);
                        return {
                            ...produto,
                            produtoNome: produtoSelecionado ? produtoSelecionado.nome : "Produto não encontrado",
                            unidade: produtoSelecionado ? unidadeMedidaMap[produtoSelecionado.unidadeMedida] : "N/A",
                            precoPorcao: produtoSelecionado ? formatValor(produtoSelecionado.valorPorcao) : "N/A"
                        };
                    })
                }));
                setProdutosDaFicha(pratosComProdutos);
            } else {
                setProdutosDaFicha([]);
            }
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao carregar produtos da ficha técnica!" });
        }
    };


    useEffect(() => {
        if (custoTotal && valorVenda) {
            const valorVendaNumerico = parseFloat(valorVenda.replace('R$', '').replace(',', '.'));
            if (!isNaN(valorVendaNumerico) && valorVendaNumerico > 0) {
                const cmvCalculado = (custoTotal / valorVendaNumerico) * 100;
                setCmvReal(cmvCalculado);
            } else {
                setCmvReal(0);
            }
        } else {
            setCmvReal(0);
        }
    }, [custoTotal, valorVenda]);

    useEffect(() => {
        if (quantidade && precoPorcao) {
            const valor = parseFloat(quantidade) * parseFloat(precoPorcao.replace('R$', '').replace(',', '.'));
            setValorUtilizado(formatValor(valor));
        } else {
            setValorUtilizado('');
        }
    }, [quantidade, precoPorcao]);


    const handleAdicionarProduto = () => {
        if (!produtoSelecionado) {
            CustomToast({ type: "error", message: "Selecione o produto!" });
            return;
        }
        if (!quantidade) {
            CustomToast({ type: "error", message: "Informe a quantidade utilizada!" });
            return;
        }

        const valorCalculado = parseFloat(quantidade) * parseFloat(precoPorcao.replace('R$', '').replace('.', '').replace(',', '.'));


        const novoProduto = {
            nome: produtoSelecionado.nome,
            unidade,
            quantidade,
            precoPorcao,
            valorUtilizado: formatValor(valorCalculado),
        };
        setProdutosAdicionados([...produtosAdicionados, novoProduto]);
        setQuantidade('');
        setValorUtilizado('');
        setProdutoSelecionado(null);
        setUnidade('');
        setPrecoPorcao('');
    };



    const handleRemoveProduto = (index) => {
        const novosProdutos = produtosAdicionados.filter((_, i) => i !== index);
        setProdutosAdicionados(novosProdutos);
    };

    const handleCadastrar = async () => {
        if (!nomePrato) {
            CustomToast({ type: "error", message: "Informe o nome do prato!" });
            return;
        }

        if (produtosAdicionados.length === 0) {
            CustomToast({ type: "error", message: "Adicione pelo menos um produto!" });
            return;
        }

        if (!valorVenda) {
            CustomToast({ type: "error", message: "Informe o valor de venda!" });
            return;
        }


        const pratoCadastrado = {
            prato: {
                nome: nomePrato,
                custoTotal: custoTotal,
                qtdRendimento: parseFloat(rendimento) || 0,
                valorRendimento: valorRendimento,
                valorVenda: parseFloat(valorVenda.replace('R$', '').replace('.', '').replace(',', '.')),
                cmvReal: cmvReal,
                lucroReal: lucroReal,
            },
            produtos: produtosAdicionados.map(produto => {
                const produtoSelecionado = produtos.find(p => p.nome === produto.nome);
                if (!produtoSelecionado) {
                    CustomToast({ type: "error", message: "Produto selecionado não é válido!" });
                    return null;
                }
                return {
                    qtdUtilizado: parseFloat(produto.quantidade),
                    valorUtilizado: parseFloat(produto.valorUtilizado.replace('R$', '').replace('.', '').replace(',', '.')),
                    produtoId: produtoSelecionado.id,
                    unidade: produto.unidade,
                    precoPorcao: produto.precoPorcao
                };
            }).filter(Boolean),
        };

        try {
            const response = await api.post(`/ficha?unidade=${unidadeId}`, pratoCadastrado);
            CustomToast({ type: "success", message: "Prato cadastrado com sucesso!" });

            setProdutosAdicionados([]);
            setNomePrato('');
            setValorVenda('');
            setCustoTotal(0);
            setLucroReal(0);
            setCmvReal(0);
            setRendimento('');
            handleFecharPrato();
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao cadastrar prato!" });
        }
        fetchProdutosDaFicha()
    };

    const handleFecharEditar = () => setEditar(false);

    const handleEditar = (prato) => {
        if (!prato || prato.id === 0) {
            CustomToast({ type: "error", message: "Prato não encontrado!" });
            return;
        }

        setPratoId(prato.id);
        setNomePrato(prato.nome);
        setCustoTotal(prato.custoTotal);
        setRendimento(prato.qtdRendimento);
        setValorVenda(formatValor(prato.valorVenda));

        if (Array.isArray(prato.produtos)) {
            const produtosAtualizados = prato.produtos.map(prod => {
                const produtoSelecionado = produtos.find(p => p.id === prod.produtoId);
                if (!produtoSelecionado) return null;

                return {
                    nome: produtoSelecionado.nome,
                    quantidade: prod.qtdUtilizado,
                    valorUtilizado: formatValor(prod.qtdUtilizado * produtoSelecionado.valorPorcao),
                    unidade: unidadeMedidaMap[produtoSelecionado.unidadeMedida],
                    precoPorcao: formatValor(produtoSelecionado.valorPorcao),
                };
            }).filter(Boolean);

            setProdutosAdicionados(produtosAtualizados);
        } else {
            setProdutosAdicionados([]);
        }

        setEditar(true);
    };
    const handleCriarPrato = () => setCriarPrato(true);
    const handleFecharPrato = () => {
        setCriarPrato(false);
        setNomePrato('');
        setProdutosAdicionados([]);
        setValorVenda('');
        setCustoTotal(0);
        setLucroReal(0);
        setCmvReal(0);
        setRendimento('');
        setPratoEmEdicao(null);
    };

    const fetchProdutos = async () => {
        try {
            const response = await api.get(`/produto?unidadeId=${unidadeId}`);
            const produtosFiltrados = response.data.data.filter(produto => produto.unidadeId === unidadeId);

            setProdutos(produtosFiltrados);
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao carregar produtos!" });
        }
    };

    const handleSalvar = async () => {
        if (!nomePrato) {
            CustomToast({ type: "error", message: "Informe o nome do prato!" });
            return;
        }

        if (produtosAdicionados.length === 0) {
            CustomToast({ type: "error", message: "Adicione pelo menos um produto!" });
            return;
        }

        if (!valorVenda) {
            CustomToast({ type: "error", message: "Informe o valor de venda!" });
            return;
        }

        const pratoAtualizado = {
            prato: {
                nome: nomePrato,
                custoTotal: custoTotal,
                qtdRendimento: parseFloat(rendimento) || 0,
                valorRendimento: valorRendimento,
                valorVenda: parseFloat(valorVenda.replace('R$', '').replace('.', '').replace(',', '.')),
                cmvReal: cmvReal,
                lucroReal: lucroReal,
            },
            produtos: produtosAdicionados.map(produto => {
                const produtoSelecionado = produtos.find(p => p.nome === produto.nome);
                if (!produtoSelecionado) {
                    CustomToast({ type: "error", message: "Produto selecionado não é válido!" });
                    return null;
                }
                return {
                    qtdUtilizado: parseFloat(produto.quantidade),
                    valorUtilizado: parseFloat(produto.valorUtilizado.replace('R$', '').replace('.', '').replace(',', '.')),
                    produtoId: produtoSelecionado.id,
                };
            }).filter(Boolean),
        };

        try {
            const response = await api.put(`/ficha/${pratoId}`, pratoAtualizado);
            CustomToast({ type: "success", message: "Prato atualizado com sucesso!" });
            handleFecharEditar(true);
            fetchProdutosDaFicha();
            setProdutosAdicionados([]);
            setNomePrato('');
            setValorVenda('');
            setCustoTotal(0);
            setLucroReal(0);
            setCmvReal(0);
            setRendimento('');
            handleFecharPrato();
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao atualizar prato!" });
        }
    };
    const handleDeletar = async (id) => {
        try {
            const response = await api.delete(`/ficha/${id}`);
            if (response.status === 200) {
                CustomToast({ type: "success", message: "Prato deletado com sucesso!" });
                fetchProdutosDaFicha();
            }
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao deletar prato!" });
        }
    };

    useEffect(() => {
        if (produtosAdicionados.length > 0) {
            const novosProdutos = produtosAdicionados.map(produto => {
                const produtoAtualizado = produtos.find(p => p.nome === produto.nome);
                if (produtoAtualizado) {
                    const novoValorPorcao = formatValor(produtoAtualizado.valorPorcao);
                    const novoValorUtilizado = parseFloat(produto.quantidade) * parseFloat(novoValorPorcao.replace('R$', '').replace(',', '.'));

                    return {
                        ...produto,
                        precoPorcao: novoValorPorcao,
                        valorUtilizado: formatValor(novoValorUtilizado),
                    };
                }
                return produto;
            });

            setProdutosAdicionados(novosProdutos);
        }
    }, [produtos]);

    useEffect(() => {
        if (custoTotal && rendimento) {
            const valorRendimentoCalculado = (custoTotal / parseFloat(rendimento)) * 1000;
            setValorRendimento(valorRendimentoCalculado);
        } else {
            setValorRendimento(0);
        }
    }, [custoTotal, rendimento]);

    const calcularValorRendimento = (tipo, valor) => {
        if (!valor) return 0; 

        const valorNumerico = parseFloat(valor);
        let resultado = 0;

        switch (tipo) {
            case 'kilograma':
                resultado = custoTotal / valorNumerico; 
                break;
            case 'grama':
                resultado = (custoTotal / valorNumerico) * 1000; 
                break;
            case 'litro':
                resultado = custoTotal / valorNumerico; 
                break;
            case 'mililitro':
                resultado = (custoTotal / valorNumerico) * 1000;
                break;
            case 'unidade':
                resultado = custoTotal * valorNumerico; 
                break;
            default:
                resultado = 0;
        }

  
        setValorRendimento(resultado);
    };

    useEffect(() => {
        if (tipoRendimentoSelecionado && rendimento) {
            calcularValorRendimento(tipoRendimentoSelecionado, rendimento);
        }
    }, [tipoRendimentoSelecionado, rendimento, custoTotal]);
    useEffect(() => {
        if (unidadeId) {
            fetchProdutos();
            fetchProdutosDaFicha();
            fetchProdutosDaFicha();
        }
    }, [unidadeId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (unidadeId && produtos.length > 0) {
            fetchProdutosDaFicha();
        }
    }, [unidadeId, produtos]);

    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex flex-col gap-3 w-full items-end'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='justify-center  md:justify-center lg:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2 lg:w-[98%]'>
                    <ContentPasteSearchIcon /> Ficha Técnica
                </h1>

                <div className='w-[100%] mt-14 flex-wrap flex items-start justify-start'>
                    <div className='ml-6 w-full gap-2 flex items-center'>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Buscar Prato"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            value={searchTerm}
                            onChange={handleSearch}
                            autoComplete="off"
                            sx={{ width: { xs: '70%', sm: '40%', md: '40%', lg: '30%' } }}
                        />

                        <ButtonComponent
                            startIcon={<AddCircleOutline fontSize='small' />}
                            title={'Criar Prato'}
                            subtitle={'Criar Prato'}
                            buttonSize="large"
                            onClick={handleCriarPrato}
                        />
                    </div>

                </div>
                <CentralModal
                    tamanhoTitulo={'81%'}
                    maxHeight={'100vh'}
                    top={'10%'}
                    left={'20%'}
                    bottom={'5%'}
                    width={'1050px'}
                    icon={<AddCircleOutline fontSize="small" />}
                    open={criarPrato}
                    onClose={handleFecharPrato}
                    title="Cadastrar Prato"
                >
                    <div>
                        <div className={` w-[94.5%] overflow-auto transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                            <div className='p-6 flex flex-wrap gap-2' style={{ border: '1px solid black', borderRadius: '10px' }}>
                                <Autocomplete
                                    options={produtos}
                                    getOptionLabel={(option) => `${option.nome} - ${formatValor(option.valorPorcao)}`}
                                    value={produtoSelecionado}
                                    noOptionsText="Nenhum produto encontrado" 
                                    onChange={(event, newValue) => {
                                        setProdutoSelecionado(newValue);
                                        if (newValue) {
                                            setUnidade(unidadeMedidaMap[newValue.unidadeMedida]);
                                            setPrecoPorcao(formatValor(newValue.valorPorcao));
                                        } else {
                                            setUnidade('');
                                            setPrecoPorcao('');
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Produto"
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                width: '240px',
                                                
                                            }}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <ArticleIcon fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />

                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Unidade"
                                    name="unidadeMedida"
                                    value={unidade}
                                    disabled
                                    autoComplete="off"
                                    sx={{
                                        width: { xs: '48%', sm: '24%', md: '40%', lg: '15%' },
                                        '& .MuiInputLabel-root': {
                                            color: 'black',
                                            fontWeight: 700
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: 'black',
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ScaleIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Preço Porção"
                                    name="precoPorcao"
                                    value={precoPorcao}
                                    autoComplete="off"
                                    sx={{
                                        width: { xs: '48%', sm: '30%', md: '40%', lg: '15%' },
                                        '& .MuiInputLabel-root': {
                                            color: 'black',
                                            fontWeight: 700
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: 'black',
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: 'black',
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MoneySharp />
                                            </InputAdornment>
                                        ),
                                    }}
                                    disabled
                                />

                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label={`Quantidade Utilizada`}
                                    name="quantidade"
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(e.target.value)}
                                    autoComplete="off"
                                    sx={{ width: { xs: '48%', sm: '48%', md: '40%', lg: '15%' } }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ScaleIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Valor Utilizado"
                                    name="valorUtilizado"
                                    value={valorUtilizado}
                                    autoComplete="off"
                                    sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '19%' } }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MoneySharp />
                                            </InputAdornment>
                                        ),
                                    }}
                                    disabled
                                />

                                <div className='flex items-end justify-end w-full'>
                                    <ButtonComponent
                                        startIcon={<AddCircleOutline fontSize='small' />}
                                        title={'Adicionar'}
                                        subtitle={'Adicionar'}
                                        buttonSize="large"
                                        onClick={handleAdicionarProduto}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={`w-[95%] mt-3 p-4 border border-gray-300 rounded-lg transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                            <div>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Nome do Prato"
                                    value={nomePrato}
                                    onChange={(e) => setNomePrato(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocalDiningIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    autoComplete="off"
                                    sx={{ width: { xs: '100%', sm: '50%', md: '40%', lg: '30%' } }}
                                />
                                <h2 className="font-bold text-xs mt-2">Produtos Adicionados:</h2>
                                <div className='w-full items-center hidden md:flex  '>
                                    <label className='md:w-[30%] lg:w-[20%]' >Produto</label>
                                    <label className='md:w-[20%] lg:w-[13%]' >Quantidade</label>
                                    <label className='md:w-[20%] lg:w-[13%]'>Valor Porção</label>
                                    <label className='md:w-[20%] lg:w-[13%]'>Valor Utilizado</label>
                                </div>
                                <div className='flex gap-4 w-full flex-wrap'>
                                    <div className='w-[100%]  lg:w-[66%]'>
                                        {produtosAdicionados.map((produto, index) => (
                                            <div key={index} className="flex justify-center flex-wrap md:justify-between items-center border-black py-2 w-full">
                                                <div style={{ border: '1px solid black', borderRadius: '10px' }} className='w-[100%] flex items-center p-1'>
                                                    <label className='text-xs w-[100%] items-center justify-center md:justify-start flex gap-2 flex-wrap'>

                                                        <p className='w-[100%] text-center md:text-start md:w-[30%] lg:w-[30%] gap-2 flex justify-center md:justify-start items-center text-xs'><FlatwareIcon />{produto.nome}</p>
                                                        <p className='w-[100%] text-center md:text-start  md:w-[20%] lg:w-[18%]' style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', backgroundColor: '#BCDA72', color: 'black', padding: '5px', borderRadius: '5px', fontWeight: '700' }}> {produto.quantidade} - {produto.unidade}</p>

                                                        <p className='w-[100%] text-center md:text-start md:w-[20%] lg:w-[20%]' style={{ display: 'flex', justifyContent: "center", backgroundColor: '#d9d9d9', color: 'black', fontWeight: '700', padding: '5px', borderRadius: '5px' }}>{produto.precoPorcao}</p>

                                                        <p className='w-[100%] text-center md:text-start md:w-[20%] lg:w-[20%]' style={{ display: 'flex', justifyContent: "center", backgroundColor: '#b0d847', color: 'black', fontWeight: '700', padding: '5px', borderRadius: '5px' }}>{produto.valorUtilizado}</p>
                                                    </label>
                                                    <ButtonClose
                                                        funcao={() => handleRemoveProduto(index)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='w-[100%] md:w-[70%] lg:w-[32%] p-2 flex flex-col gap-2' style={{ border: '1px solid black', borderRadius: '10px' }}>
                                        <div className='flex items-center w-full '>
                                            <label className='text-xs font-bold w-[60%]'>Custo Total: </label>
                                            <label className='text-xs font-bold w-[40%] p-1 pl- items-start justify-start' style={{ backgroundColor: '#b0d847', borderRadius: '10px', }}>
                                                {formatValor(custoTotal)}
                                            </label>
                                        </div>
                                        <div className='flex items-center w-full gap-3 '>

                                            <SelectTextFields
                                                width={'150px'}
                                                icon={<EqualizerIcon fontSize="small" />}
                                                label={'Tipo de Rendimento'}
                                                backgroundColor={"#D9D9D9"}
                                                fontWeight={500}
                                                options={tipoRendimentoOptions}
                                                onChange={(e) => {
                                                    setTipoRendimentoSelecionado(e.target.value);
                                                    calcularValorRendimento(e.target.value, rendimento);
                                                }}
                                            />

                                            <input
                                                type="text"
                                                value={rendimento}
                                                onChange={(e) => {
                                                    setRendimento(e.target.value);
                                                    calcularValorRendimento(tipoRendimentoSelecionado, e.target.value);
                                                }}
                                                style={{
                                                    backgroundColor: "#d9d9d9",
                                                    color: 'black',
                                                    borderRadius: '10px',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    width: '40%',
                                                    padding: '2px',
                                                    border: '1px solid #ccc',
                                                    outline: 'none'
                                                }}
                                            />


                                        </div>
                                        <div className='flex items-center w-full '>
                                            <label className='text-xs font-bold w-[60%]'>Valor do Rendimento(Kg/Ml/Uni): </label>
                                            <label className='text-xs font-bold w-[40%] p-1 pl- items-center justify-start' style={{ backgroundColor: '#BCDA72', borderRadius: '10px', }}>
                                                {formatValor(valorRendimento)}   {/* Exibindo o valor do rendimento calculado */}
                                            </label>
                                        </div>
                                        <div className='flex items-center w-full '>
                                            <label className='text-xs font-bold w-[60%]'>Valor Venda: </label>
                                            <NumericFormat
                                                value={valorVenda}
                                                onValueChange={(values) => {
                                                    const { formattedValue, value } = values;
                                                    setValorVenda(formattedValue);
                                                }}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                prefix={'R$ '}
                                                className='text-xs font-bold w-[40%] p-1 pl- items-center justify-start'
                                                style={{
                                                    backgroundColor: '#BCDA72',
                                                    borderRadius: '10px',
                                                    border: '1px solid #ccc',
                                                    outline: 'none',
                                                    padding: '5px',
                                                }}
                                            />
                                        </div>
                                        <div className='flex items-center w-full '>
                                            <label className='text-xs font-bold w-[60%]'>CMV Real: </label>
                                            <label className='text-xs font-bold w-[40%] p-1 pl- items-center justify-start' style={{ backgroundColor: '#BCDA72', borderRadius: '10px', }}>
                                                {cmvReal.toFixed(2)}%
                                            </label>
                                        </div>
                                        <div className='flex items-center w-full '>
                                            <label className='text-xs font-bold w-[60%]'>Lucro Real: </label>
                                            <label className='text-xs font-bold w-[40%] p-1 pl- items-center justify-start' style={{ backgroundColor: '#d9d9d9', borderRadius: '10px', }}>
                                                {formatValor(lucroReal)}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full flex items-end justify-end mt-2'>
                                    <ButtonComponent
                                        startIcon={<Save fontSize='small' />}
                                        title={'Cadastrar'}
                                        subtitle={'Cadastrar'}
                                        buttonSize="large"
                                        onClick={handleCadastrar}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </CentralModal>
                <div className={`mr-3 sm: md:mr-11 flex flex-wrap w-[95%] p-4 gap-3 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                    {loading ? (
                        <div className="flex w-full flex-col items-center justify-center gap-5 h-96">
                            <TableLoading />
                            <label className="text-sm">Carregando...</label>
                        </div>
                    ) : filteredPratos.length === 0 ? (
                        <div className="flex w-full flex-col items-center justify-center gap-5 h-96">
                            <TableLoading />
                            <label className="text-sm">Nenhum prato encontrado!</label>
                        </div>
                    ) : (
                        <TabelaProdutos
                            pratos={filteredPratos}
                            onEditClick={(prato) => handleEditar(prato)}
                            onDeleteClick={(id) => handleDeletar(id)}
                        />
                    )}
                </div>
            </div>
            <CentralModal
                tamanhoTitulo={'81%'}
                maxHeight={'100vh'}
                top={'5%'}
                left={'15%'}
                bottom={'5%'}
                width={'1050px'}
                icon={<Edit fontSize="small" />}
                open={editar}
                onClose={handleFecharEditar}
                title="Editar Prato"
            >
                <div>
                    <div className={` w-[94.5%] overflow-auto transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <div className='p-6 flex flex-wrap gap-2' style={{ border: '1px solid black', borderRadius: '10px' }}>
                            <Autocomplete
                                options={produtos}
                                getOptionLabel={(option) => `${option.nome} - ${formatValor(option.valorPorcao)}`}
                                value={produtoSelecionado}
                                noOptionsText="Nenhum produto encontrado"
                                onChange={(event, newValue) => {
                                    setProdutoSelecionado(newValue);
                                    if (newValue) {
                                        setUnidade(unidadeMedidaMap[newValue.unidadeMedida]);
                                        setPrecoPorcao(formatValor(newValue.valorPorcao));
                                    } else {
                                        setUnidade('');
                                        setPrecoPorcao('');
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Produto"
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            width: '240px',
                                            
                                        }}
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ArticleIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Unidade"
                                name="unidadeMedida"
                                value={unidade}
                                disabled
                                autoComplete="off"
                                sx={{
                                    width: { xs: '48%', sm: '24%', md: '40%', lg: '15%' },
                                    '& .MuiInputLabel-root': {
                                        color: 'black',
                                        fontWeight: 700
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'black',
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ScaleIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Preço Porção"
                                name="precoPorcao"
                                value={precoPorcao}
                                autoComplete="off"
                                sx={{
                                    width: { xs: '48%', sm: '30%', md: '40%', lg: '15%' },
                                    '& .MuiInputLabel-root': {
                                        color: 'black',
                                        fontWeight: 700
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'black',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'black',
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MoneySharp />
                                        </InputAdornment>
                                    ),
                                }}
                                disabled
                            />

                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label={`Quantidade Utilizada`}
                                name="quantidade"
                                value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '48%', sm: '48%', md: '40%', lg: '15%' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ScaleIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Valor Utilizado"
                                name="valorUtilizado"
                                value={valorUtilizado}
                                autoComplete="off"
                                sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '19%' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MoneySharp />
                                        </InputAdornment>
                                    ),
                                }}
                                disabled
                            />

                            <div className='flex items-end justify-end w-full'>
                                <ButtonComponent
                                    startIcon={<AddCircleOutline fontSize='small' />}
                                    title={'Adicionar'}
                                    subtitle={'Adicionar'}
                                    buttonSize="large"
                                    onClick={handleAdicionarProduto}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={`w-[95%] mt-3 p-4 border border-gray-300 rounded-lg transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <div>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Nome do Prato"
                                value={nomePrato}
                                onChange={(e) => setNomePrato(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocalDiningIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                autoComplete="off"
                                sx={{ width: { xs: '100%', sm: '50%', md: '40%', lg: '30%' } }}
                            />
                            <h2 className="font-bold text-xs mt-2">Produtos Adicionados:</h2>
                            <div className='w-full items-center hidden md:flex  '>
                                <label className='md:w-[30%] lg:w-[20%]' >Produto</label>
                                <label className='md:w-[20%] lg:w-[13%]' >Quantidade</label>
                                <label className='md:w-[20%] lg:w-[13%]'>Valor Porção</label>
                                <label className='md:w-[20%] lg:w-[13%]'>Valor Utilizado</label>
                            </div>
                            <div className='flex gap-4 w-full flex-wrap'>
                                <div className='w-[100%] lg:w-[66%]'>
                                    {produtosAdicionados.map((produto, index) => (
                                        <div key={index} className="flex justify-center flex-wrap md:justify-between items-center border-black py-2 w-full">
                                            <div style={{ border: '1px solid black', borderRadius: '10px' }} className='w-[100%] flex items-center p-1'>
                                                <label className='text-xs w-[100%] items-center justify-center md:justify-start flex gap-2 flex-wrap'>
                                                    <p className='w-[100%] text-center md:text-start md:w-[30%] lg:w-[30%] gap-2 flex justify-center md:justify-start items-center text-xs'>
                                                        <FlatwareIcon />{produto.nome}
                                                    </p>
                                                    <p className='w-[100%] text-center md:text-start md:w-[20%] lg:w-[18%]' style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', backgroundColor: '#BCDA72', color: 'black', padding: '5px', borderRadius: '5px', fontWeight: '700' }}>
                                                        {produto.quantidade} - {produto.unidade}
                                                    </p>
                                                    <p className='w-[100%] text-center md:text-start md:w-[20%] lg:w-[20%]' style={{ display: 'flex', justifyContent: "center", backgroundColor: '#d9d9d9', color: 'black', fontWeight: '700', padding: '5px', borderRadius: '5px' }}>
                                                        {produto.precoPorcao}
                                                    </p>
                                                    <p className='w-[100%] text-center md:text-start md:w-[20%] lg:w-[20%]' style={{ display: 'flex', justifyContent: "center", backgroundColor: '#b0d847', color: 'black', fontWeight: '700', padding: '5px', borderRadius: '5px' }}>
                                                        {produto.valorUtilizado}
                                                    </p>
                                                </label>
                                                <ButtonClose
                                                    funcao={() => handleRemoveProduto(index)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='w-[100%] md:w-[70%] lg:w-[32%] p-2 flex flex-col gap-2' style={{ border: '1px solid black', borderRadius: '10px' }}>
                                    <div className='flex items-center w-full '>
                                        <label className='text-xs font-bold w-[60%]'>Custo Total: </label>
                                        <label className='text-xs font-bold w-[40%] p-1 pl- items-start justify-start' style={{ backgroundColor: '#b0d847', borderRadius: '10px', }}>
                                            {formatValor(custoTotal)}
                                        </label>
                                    </div>
                                    <div className='flex items-center w-full gap-3 '>

                                        <SelectTextFields
                                            width={'150px'}
                                            icon={<EqualizerIcon fontSize="small" />}
                                            label={'Tipo de Rendimento'}
                                            backgroundColor={"#D9D9D9"}
                                            fontWeight={500}
                                            options={tipoRendimentoOptions}
                                            onChange={(e) => {
                                                setTipoRendimentoSelecionado(e.target.value);
                                                calcularValorRendimento(e.target.value, rendimento);
                                            }}
                                        />

                                        <input
                                            type="text"
                                            value={rendimento}
                                            onChange={(e) => {
                                                setRendimento(e.target.value);
                                                calcularValorRendimento(tipoRendimentoSelecionado, e.target.value); 
                                            }}
                                            style={{
                                                backgroundColor: "#d9d9d9",
                                                color: 'black',
                                                borderRadius: '10px',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                width: '40%',
                                                padding: '2px',
                                                border: '1px solid #ccc',
                                                outline: 'none'
                                            }}
                                        />


                                    </div>
                                    <div className='flex items-center w-full '>
                                        <label className='text-xs font-bold w-[60%]'>Valor do Rendimento(Kg/Ml/Uni): </label>
                                        <label className='text-xs font-bold w-[40%] p-1 pl- items-center justify-start' style={{ backgroundColor: '#BCDA72', borderRadius: '10px', }}>
                                            {formatValor(valorRendimento)}   {/* Exibindo o valor do rendimento calculado */}
                                        </label>
                                    </div>
                                    <div className='flex items-center w-full '>
                                        <label className='text-xs font-bold w-[60%]'>Valor Venda: </label>
                                        <NumericFormat
                                            value={valorVenda}
                                            onValueChange={(values) => {
                                                const { formattedValue, value } = values;
                                                setValorVenda(formattedValue);
                                            }}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            prefix={'R$ '}
                                            className='text-xs font-bold w-[40%] p-1 pl- items-center justify-start'
                                            style={{
                                                backgroundColor: '#BCDA72',
                                                borderRadius: '10px',
                                                border: '1px solid #ccc',
                                                outline: 'none',
                                                padding: '5px',
                                            }}
                                        />
                                    </div>
                                    <div className='flex items-center w-full '>
                                        <label className='text-xs font-bold w-[60%]'>CMV Real: </label>
                                        <label className='text-xs font-bold w-[40%] p-1 pl- items-center justify-start' style={{ backgroundColor: '#BCDA72', borderRadius: '10px', }}>
                                            {cmvReal.toFixed(2)}%
                                        </label>
                                    </div>
                                    <div className='flex items-center w-full '>
                                        <label className='text-xs font-bold w-[60%]'>Lucro Real: </label>
                                        <label className='text-xs font-bold w-[40%] p-1 pl- items-center justify-start' style={{ backgroundColor: '#d9d9d9', borderRadius: '10px', }}>
                                            {formatValor(lucroReal)}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex items-end justify-end mt-2'>
                                <ButtonComponent
                                    startIcon={<Save fontSize='small' />}
                                    title={'Salvar'}
                                    subtitle={'Salvar'}
                                    buttonSize="large"
                                    onClick={handleSalvar}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </CentralModal>

        </div>
    );
}

export default FichaTecnica;