import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import HeaderCadastro from '../../../components/navbars/cadastro';
import ButtonComponent from '../../../components/button';
import CentralModal from '../../../components/modal-central';
import TableComponent from '../../../components/table';
import { headerCategoria } from '../../../entities/headers/header-categoria';
import ModalLateral from '../../../components/modal-lateral';
import CustomToast from '../../../components/toast';
import api from '../../../services/api';
import TableLoading from '../../../components/loading/loading-table/loading';
import { useNavigate } from 'react-router-dom';
import { useUnidade } from '../../../components/unidade-context';

import CategoryIcon from '@mui/icons-material/Category';
import { InputAdornment, TextField, } from '@mui/material';
import { Edit, Save } from "@mui/icons-material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import ArticleIcon from '@mui/icons-material/Article';



const Categoria = () => {
    const navigate = useNavigate();
    const { unidadeId } = useUnidade();
    const [isDesativa, setDesativa] = useState(false);
    const [cadastroCategoria, setCadastroCategoria] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editandoCategoria, setEditandoCategoria] = useState(false);
    const [categoriaEditada, setCategoriaEditada] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const [categorias, setCategorias] = useState([]);
    const [userOptionsUnidade, setUserOptionsUnidade] = useState([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);

    const [categoria, setCategoria] = useState({ nome: '', unidadeId: '' });
    const [filtroNome, setFiltroNome] = useState('');
    const [mensagemErro, setMensagemErro] = useState('');


    const handleCadastroCategoria = () => setCadastroCategoria(true);
    const handleCloseCadastroCategoria = () => setCadastroCategoria(false);

    const carregarCategorias = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/categoria`);
            if (Array.isArray(response.data.data)) {
                const categoriasFiltradas = response.data.data
                    .filter(cat => cat.unidadeId === unidadeId)
                    .map(categoria => ({
                        ...categoria,
                        status: categoria.isAtivo ? "Ativo" : "Inativo" 
                    }));
                
                setCategorias(categoriasFiltradas);
            } else {
                setCategorias([]);
            }
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
            CustomToast({ type: "error", message: "Erro ao buscar categorias." });
        } finally {
            setLoading(false);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoria({ ...categoria, [name]: value });
    };

    const handleCadastrarCategoria = async () => {
        setDesativa(true);
        try {
            const novaCategoria = {
                nome: categoria.nome,
                unidadeId: unidadeId
            };
            await api.post('/categoria', novaCategoria);
            await carregarCategorias(unidadeId);
            setCategoria({ nome: '', unidadeId: '' });
            handleCloseCadastroCategoria();
            CustomToast({ type: "success", message: "Categoria cadastrada com sucesso!" });
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao cadastrar categoria." });
        } finally {
            setDesativa(false);
        }
    };

    const handleEditCategoria = (categoria) => {
        setCategoriaEditada({ ...categoria });
        setEditandoCategoria(true);
    };

    const handleSaveEdit = async () => {
        if (categoriaEditada) {
            try {
                await api.put(`/categoria/${categoriaEditada.id}`, categoriaEditada);
                await carregarCategorias(unidadeId);
                setEditandoCategoria(false);
                setCategoriaEditada(null);
                CustomToast({ type: "success", message: "Categoria editada com sucesso!" });
            } catch (error) {
                CustomToast({ type: "error", message: "Erro ao editar categoria." });
            }
        }
    };

    const handleDeleteCategoria = async (categoria) => {
        try {
            const response = await api.delete(`/categoria/${categoria.id}`);
            await carregarCategorias(unidadeId);
            
            if (response.data && response.data.message) {
                CustomToast({ type: "success", message: response.data.message });
            } 
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao deletar categoria." });
        }
    };

    const carregarUnidades = async () => {
        try {
            const response = await api.get("/unidade");
            const unidadesOptions = response.data.data.map(unidade => ({
                value: unidade.id,
                label: unidade.nome
            }));
            setUserOptionsUnidade(unidadesOptions);
        } catch (error) {
            console.error("Erro ao carregar as unidades:", error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        carregarUnidades();
    }, []);

    useEffect(() => {
        if (unidadeId) {
            carregarCategorias(); 
        }
    }, [unidadeId]);

    useEffect(() => {

        const categoriasFiltradas = categorias.filter(categoria =>
            categoria.nome.toLowerCase().includes(filtroNome.toLowerCase()),
            categoria.isAtivo
        );
        setProdutosFiltrados(categoriasFiltradas);


        if (categoriasFiltradas.length === 0 && filtroNome) {
            setMensagemErro('Nenhuma categoria encontrada nenhuma categoria');
        } else {
            setMensagemErro('');
        }
    }, [filtroNome, categorias]);


    useEffect(() => {
        if (unidadeId) {
            carregarCategorias(unidadeId);
        }
    }, [unidadeId]);

    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-0 lg:ml-2'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='justify-center  md:justify-center lg:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2 '>
                    <CategoryIcon /> Categoria
                </h1>
                <div className={`items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                <div className="hidden lg:w-[14%] lg:flex  ">
                        <HeaderCadastro />
                    </div>
                    <div className="w-[100%] itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col lg:w-[80%]">
                        <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Buscar categoria"
                                value={filtroNome}
                                onChange={(e) => setFiltroNome(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CategoryIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                autoComplete="off"
                                sx={{ width: { xs: '72%', sm: '50%', md: '40%', lg: '40%' }, }}
                            />
                            <ButtonComponent
                                startIcon={<AddCircleOutline fontSize='small' />}
                                title={'Cadastrar'}
                                subtitle={'Cadastrar'}
                                buttonSize="large"
                                onClick={handleCadastroCategoria}
                            />
                        </div>

                        <div className="tamanho-tabela">
                            {loading ? (
                                <div className='flex items-center justify-center h-96'>
                                    <TableLoading />
                                </div>
                            ) : (
                                <>
                                    {produtosFiltrados.length === 0 ? (
                                        <div className="flex w-full flex-col items-center justify-center gap-5 h-96">
                                            <TableLoading />
                                            <label className="text-sm">Não foi encontrado nenhuma categoria!</label>
                                        </div>
                                    ) : (
                                        <TableComponent
                                            headers={headerCategoria}
                                            rows={produtosFiltrados}
                                            actionsLabel={"Ações"}
                                            actionCalls={{
                                                edit: handleEditCategoria,
                                                inactivate: handleDeleteCategoria,
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <CentralModal
                tamanhoTitulo={'81%'}
                maxHeight={'90vh'}
                top={'20%'}
                left={'28%'}
                width={'400px'}
                icon={<AddCircleOutline fontSize="small" />}
                open={cadastroCategoria}
                onClose={handleCloseCadastroCategoria}
                title="Cadastrar Categoria"
            >
                <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                    <div className='mt-4 flex gap-3 flex-wrap'>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Nome da Categoria"
                            name="nome"
                            value={categoria.nome}
                            onChange={handleInputChange}
                            sx={{ width: { xs: '95%', sm: '100%', md: '40%', lg: '95%' } }}
                            autoComplete="off"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ArticleIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div className='w-[95%] mt-2 flex items-end justify-end'>
                        <ButtonComponent
                            title={'Cadastrar'}
                            subtitle={'Cadastrar'}
                            startIcon={<Save />}
                            onClick={handleCadastrarCategoria}
                            disabled={isDesativa}
                        />
                    </div>
                </div>
            </CentralModal>

            <ModalLateral
                open={editandoCategoria}
                handleClose={() => setEditandoCategoria(false)}
                tituloModal="Editar Categoria"
                icon={<Edit />}
                tamanhoTitulo={'75%'}
                conteudo={
                    <div className='flex gap-2 flex-wrap items-end justify-end w-full mt-2'>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Nome da Categoria"
                            name="nome"
                            value={categoriaEditada ? categoriaEditada.nome : ''}
                            onChange={(e) => setCategoriaEditada({ ...categoriaEditada, nome: e.target.value })}
                            autoComplete="off"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CategoryIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <ButtonComponent
                            title={'Salvar'}
                            subtitle={'Salvar'}
                            startIcon={<Save />}
                            onClick={handleSaveEdit}
                        />
                    </div>
                }
            />
        </div>
    );
}

export default Categoria;