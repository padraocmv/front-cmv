import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableComponent from '../../../components/table';
import { formatValor } from '../../../utils/functions';
import HeaderRelatorio from '../../../components/navbars/relatorios';
import ButtonComponent from '../../../components/button';
import { Print } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Objeto from '../../../assets/icones/objetos.png';
import Baixo from '../../../assets/icones/abaixo.png';
import { FormControlLabel, IconButton, Switch } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CentralModal from '../../../components/modal-central';
import SelectTextFields from '../../../components/select';
import CategoryIcon from '@mui/icons-material/Category';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Logo from '../../../assets/png/logo_preta.png';
import api from '../../../services/api';
import CustomToast from '../../../components/toast';
import { useUnidade } from '../../../components/unidade-context';

const EstoqueReal = () => {
    const { unidadeId } = useUnidade();
    const [produtos, setProdutos] = useState([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [filtro, setFiltro] = useState(false);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [limparCampos, setLimparCampos] = useState(false);
    const [logoLoaded, setLogoLoaded] = useState(false);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await api.get(`/produto?unidadeId=${unidadeId}`);
                const produtosCadastrados = response.data.data.filter(produto => produto.unidadeId === unidadeId);
                setProdutos(produtosCadastrados);
                setProdutosFiltrados(produtosCadastrados);
            } catch (error) {
                CustomToast({ type: "error", message: "Erro ao carregar produtos!" });
            }
        };

        const fetchCategorias = async () => {
            try {
                const response = await api.get(`/categoria?unidadeId=${unidadeId}`);
                const categoriasFiltradas = response.data.data.filter(categoria => categoria.unidadeId === unidadeId);
                setCategorias(categoriasFiltradas);
            } catch (error) {
                CustomToast({ type: "error", message: "Erro ao carregar categorias!" });
            }
        };

        if (unidadeId) {
            fetchProdutos();
            fetchCategorias();
        }
    }, [unidadeId]);

    const handleLimparCampos = () => {
        setDataInicio('');
        setDataFim('');
        setSelectedCategoria('');
        setProdutosFiltrados(produtos);
        CustomToast({ type: "success", message: "Filtros limpos com sucesso!" });
    };

    const handlePesquisar = () => {
        const produtosFiltrados = produtos.filter(produto => {
            const categoriaMatch = !selectedCategoria || produto.categoriaId === selectedCategoria;
            return categoriaMatch;
        });

        setProdutosFiltrados(produtosFiltrados);
        if (produtosFiltrados.length === 0) {
            CustomToast({ type: "info", message: "Nenhum produto encontrado com os critérios de pesquisa." });
        } else {
            CustomToast({ type: "success", message: "Filtro aplicado com sucesso!" });
        }
    };

    const handlePrint = () => {
        if (!logoLoaded) {
            CustomToast({ type: "info", message: "Aguarde o carregamento da logo antes de imprimir." });
            return;
        }

        const printWindow = window.open('', '_blank');
        const tableHTML = `
            <html>
                <head>
                    <title>Imprimir Estoque</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            background-color: white;
                            color: black;
                            text-align: center;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 20 px;
                        }
                        th, td { 
                            border: 1px solid #000;
                            padding: 8px; 
                            text-align: left; 
                        }
                        th { 
                            background-color: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    <img src="${Logo}" alt="Logo" />
                    <h1>Relatório de Estoque</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Categoria</th>
                                <th>Unidade</th>
                                <th>Quantidade Mínima</th>
                                <th>Estoque Atual</th>
                                <th>Preço Unitário</th>
                                <th>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${produtosFiltrados.map(produto => `
                                <tr>
                                    <td>${produto.nome}</td>
                                    <td>${produto.categoriaNome || 'Sem Categoria'}</td>
                                    <td>${produto.unidadeMedida || 'Desconhecida'}</td>
                                    <td>${produto.qtdMin || 0}</td>
                                    <td>${produto.quantidade || 0}</td>
                                    <td>${formatValor(produto.valorPorcao || 0)}</td>
                                    <td>${formatValor((produto.quantidade || 0) * (produto.valorPorcao || 0))}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
        printWindow.document.write(tableHTML);
        printWindow.document.close();
        printWindow.print();
    };

    const handleCloseFiltro = () => setFiltro(false);

    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-0 lg:ml-2'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='justify-center md:justify-center lg:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex gap-2 '>
                    <BarChartIcon /> Estoque Real
                </h1>
                <div className="items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
                <div className="hidden lg:w-[14%] lg:flex  ">
                        <HeaderRelatorio />
                    </div>
                    <div className={`w-[100%] lg:w-[80%] itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col`}>
                        <div className='w-[99%] justify-center flex-wrap mb-4 flex items-center gap-4'>
                            <div className='w-[80%] md:w-[30%] lg:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
                                <label className='text-xs font-bold'>Itens em Estoque</label>
                                <div className='flex items-center justify-center gap-5'>
                                    <img src={Objeto} alt="Total Movimentações" />
                                    <label>{produtosFiltrados.reduce((total, produto) => total + (produto.quantidade || 0), 0).toFixed(2)}</label>
                                </div>
                            </div>
                            <div className='w-[80%] md:w-[30%] lg:w-[30%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
                                <label className='text-xs font-bold'>Quantidade Itens Mínimo</label>
                                <div className='flex items-center justify-center gap-5'>
                                    <img src={Baixo} alt="Entradas" />
                                    <label>{produtosFiltrados.filter(produto => (produto.quantidade || 0) < (produto.qtdMin || 0)).length}</label>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                            <ButtonComponent
                                title="Imprimir"
                                subtitle="Imprimir"
                                startIcon={<Print />}
                                onClick={handlePrint}
                            />
                            <IconButton title="Filtro"
                                onClick={() => setFiltro(true)}
                                className='view-button w-10 h-10 '
                                sx={{
                                    color: 'black',
                                    border: '1px solid black',
                                    '&:hover': {
                                        color: '#fff',
                                        backgroundColor: '#BCDA72',
                                        border: '1px solid black'
                                    }
                                }} >
                                <FilterAltIcon fontSize={"small"} />
                            </IconButton>
                        </div>
                        <div className='w-[100%] flex flex-col ml-3 md:ml-0'>
                            <TableComponent
                                headers={[
                                    { label: 'Produto', key: 'nome' },
                                    { label: 'Categoria', key: 'categoriaNome' },
                                    { label: 'Unidade', key: 'unidadeMedida' },
                                    { label: 'Quantidade Mínima', key: 'qtdMin' },
                                    { label: 'Estoque Atual', key: 'quantidade' },
                                    { label: 'Preço Unitário', key: 'valorPorcao' },
                                    { label: 'Valor Total', key: 'valorTotal' },
                                ]}
                                rows={produtosFiltrados.map(produto => ({
                                    ...produto,
                                    valorTotal: formatValor((produto.quantidade || 0) * (produto.valorPorcao || 0)),
                                }))}
                                actionsLabel={"Ações"}
                                actionCalls={{}}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <CentralModal
                tamanhoTitulo={'81%'}
                maxHeight={'100vh'}
                top={'20%'}
                left={'28%'}
                width={'400px'}
                icon={<FilterAltIcon fontSize="small" />}
                open={filtro}
                onClose={handleCloseFiltro}
                title="Filtro"
            >
                <div>
                    <div className='mt-4 flex gap-3 flex-wrap'>
                        <SelectTextFields
                            width={'175px'}
                            icon={<CategoryIcon fontSize="small" />}
                            label={'Categoria'}
                            backgroundColor={"#D9D9D9"}
                            name={"categoria"}
                            fontWeight={500}
                            options={categorias.map(categoria => ({ label: categoria.nome, value: categoria.id }))}
                            onChange={(e) => setSelectedCategoria(e.target.value)}
                            value={selectedCategoria}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    style={{ marginLeft: '5px' }}
                                    size="small"
                                    checked={limparCampos}
                                    onChange={handleLimparCampos}
                                    color="primary"
                                />
                            }
                            label="Limpar Filtro"
                        />
                    </div>
                    <div className='w-[95%] mt-2 flex items-end justify-end'>
                        <ButtonComponent
                            title={'Pesquisar'}
                            subtitle={'Pesquisar'}
                            startIcon={<SearchIcon />}
                            onClick={handlePesquisar}
                        />
                    </div>
                </div>
            </CentralModal>
            <img src={Logo} alt="Logo" onLoad={() => setLogoLoaded(true)} style={{ display: 'none' }} />
        </div>
    );
}

export default EstoqueReal;