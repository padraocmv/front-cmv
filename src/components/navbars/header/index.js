import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/png/logo.png';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from '@mui/icons-material/Person';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CloseIcon from "@mui/icons-material/Close";
import BarChartIcon from '@mui/icons-material/BarChart';
import { Button, Drawer, IconButton, List, Tooltip } from '@mui/material';
import AddchartIcon from '@mui/icons-material/Addchart';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Navbar = ({ user }) => {
    const [activeRoute, setActiveRoute] = useState("");
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showCadastroSubMenu, setShowCadastroSubMenu] = useState(false);
    const [collapsed, setCollapsed] = useState(() => {
        // Recupera o estado do localStorage ou usa false como padrão
        const savedState = localStorage.getItem('menuCollapsed');
        return savedState ? JSON.parse(savedState) : false;
    });

    const tipoUsuario = localStorage.getItem('tipo');
    const isUsuarioTipo3 = tipoUsuario === "3";

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleCollapse = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        // Salva o estado no localStorage
        localStorage.setItem('menuCollapsed', JSON.stringify(newState));
    };

    const handleNavigate = (route) => {
        navigate(route);
        localStorage.setItem("page", route);
        setActiveRoute(route);
        if (route === '/cadastro') {
            localStorage.setItem("page-cadastro", route);
        }
    };

    useEffect(() => {
        const savedPage = localStorage.getItem("page");
        if (savedPage && savedPage !== activeRoute) {
            setActiveRoute(savedPage);
        }
    }, []);

    return (
        <div className='hidden sm:hidden md:hidden lg:block' style={{ backgroundColor: 'black' }}>
            <div className="lg:block hidden h-[100%]">
                <div className={`transition-all ${collapsed ? 'w-20' : 'w-64'} h-screen bg-cover bg-no-repeat bg-center flex flex-col p-5 relative`} style={{ backgroundColor: 'black',  }}>
                    <div className="flex flex-col justify-center items-center mb-5 cursor-pointer" onClick={() => handleNavigate("/dashboard")}>
                        <img 
                            src={logo} 
                            alt="Logo" 
                            style={{ 
                                backgroundColor: 'black', 
                                padding: collapsed ? '5px' : '15px', 
                                borderRadius: "10px", 
                                width: collapsed ? '80%' : '65%' 
                            }} 
                            title={user ? "Clique para acessar a Dashboard" : ''} 
                        />
                        {!collapsed && <label className='text-white text-xs'>Controle de Estoque</label>}
                    </div>

                    <div style={{backgroundColor:'#b0d847', color:"black"}}
                        className="absolute top-5 -right-3  rounded-full cursor-pointer"
                        onClick={toggleCollapse}
                        title={collapsed ? "Expandir menu" : "Recolher menu"}
                    >
                        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </div>

                    <div className="flex flex-col gap-2 text-white overflow-hidden transition-all">
                        {!collapsed && <label className="text-sm mt-1 text-white font-bold">Home</label>}
                        <Tooltip title="Dashboard" placement="right" arrow>
                            <button
                                onClick={() => handleNavigate("/dashboard")}
                                className={`flex items-center bg-white text-black font-bold rounded p-3  py-2 gap-2 text-sm ${activeRoute === "/dashboard" ? "border-b-2 border-primary" : ""}`}
                            >
                                <DashboardIcon fontSize={"small"} />
                                {!collapsed && <span>Dashboard</span>}
                            </button>
                        </Tooltip>

                        {!collapsed && <label className="text-sm mt-1 text-white font-bold">Funções</label>}
                        <Tooltip title="Entradas/Saída" placement="right" arrow>
                            <button
                                onClick={() => handleNavigate("/entrada-saida")}
                                className={`flex items-center bg-white text-black font-bold rounded p-3  py-2 gap-2 text-sm ${activeRoute === "/entrada-saida" ? "border-b-2 border-primary" : ""}`}
                            >
                                <AddchartIcon fontSize={"small"} />
                                {!collapsed && <span>Entradas/Saída</span>}
                            </button>
                        </Tooltip>

                        {/* Exibir "CMV" e "Ficha Técnica" apenas se não for usuário tipo 3 */}
                        {!isUsuarioTipo3 && (
                            <>
                                <Tooltip title="CMV" placement="right" arrow>
                                    <button
                                        onClick={() => handleNavigate("/cmv")}
                                        className={`flex items-center bg-white text-black font-bold rounded p-3  py-2 gap-2 text-sm ${activeRoute === "/cmv" ? "border-b-2 border-primary" : ""}`}
                                    >
                                        <AddToQueueIcon fontSize={"small"} />
                                        {!collapsed && <span>CMV</span>}
                                    </button>
                                </Tooltip>
                                <Tooltip title="Ficha Técnica" placement="right" arrow>
                                    <button
                                        onClick={() => handleNavigate("/ficha-tecnica")}
                                        className={`flex items-center bg-white text-black font-bold rounded p-3  py-2 gap-2 text-sm ${activeRoute === "/ficha-tecnica" ? "border-b-2 border-primary" : ""}`}
                                    >
                                        <ContentPasteSearchIcon fontSize={"small"} />
                                        {!collapsed && <span>Ficha Técnica</span>}
                                    </button>
                                </Tooltip>
                            </>
                        )}

                        <Tooltip title="Relatório" placement="right" arrow>
                            <button
                                onClick={() => handleNavigate("/relatorio")}
                                className={`flex items-center bg-white text-black font-bold rounded p-3 py-2 gap-2 text-sm ${activeRoute === "/relatorios" ? "border-b-2 border-primary" : ""}`}
                            >
                                <DataThresholdingIcon fontSize={"small"} />
                                {!collapsed && <span>Relatório</span>}
                            </button>
                        </Tooltip>

                        {!collapsed && <label className="text-sm mt-1 text-white font-bold">Configurações</label>}
                        <Tooltip title="Cadastro de Configurações" placement="right" arrow>
                            <button
                                onClick={() => handleNavigate("/cadastro")}
                                className={`flex items-center bg-white text-black font-bold rounded p-3 py-2 gap-2 text-sm  ${activeRoute === "/cadastro" ? "border-b-2 border-primary" : ""}`}
                            >
                                <MiscellaneousServicesIcon fontSize={"small"} />
                                {!collapsed && <span>Cadastro</span>}
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>

            {/* Restante do código para a versão mobile permanece igual */}
            <div className="lg:hidden flex w-full h-[50px] bg-primary fixed top-0 left-0 z-10">
                {user ?
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <IconButton onClick={toggleMenu} style={{ color: "white" }}>
                            <MenuIcon />
                        </IconButton>
                    </div>
                    : <></>
                }
                <div className="flex justify-center items-center w-full h-full">
                    <img
                        src={logo}
                        alt="Logo"
                        title="Clique para acessar a Dashboard"
                        className="w-20"
                    />
                </div>
                <Drawer anchor="left" open={menuOpen} onClose={toggleMenu}>
                    <div className="w-64">
                        <div className="flex justify-between items-center px-4 py-2 border-b">
                            <h2 className="text-lg font-bold">Menu</h2>
                            <IconButton onClick={toggleMenu}>
                                <CloseIcon />
                            </IconButton>
                        </div>

                        <List>
                            {/* Exibir "Dashboard" apenas se não for usuário tipo 3 */}
                            {!isUsuarioTipo3 && (
                                <Button
                                    fullWidth
                                    onClick={() => handleNavigate("/dashboard")}
                                    startIcon={<DashboardIcon fontSize="small" />}
                                    className="text-left"
                                    title="Ir para Pagamentos"
                                    sx={{
                                        justifyContent: "flex-start",
                                        padding: "10px 16px",
                                        textTransform: "none",
                                        "&:hover": {
                                            backgroundColor: "#f4f4f4",
                                        },
                                    }}
                                >
                                    Pagamentos
                                </Button>
                            )}

                            {/* Exibir "Cadastro" e submenu apenas se não for usuário tipo 3 */}
                            {!isUsuarioTipo3 && (
                                <div>
                                    <Button
                                        fullWidth
                                        onClick={() => setShowCadastroSubMenu(!showCadastroSubMenu)}
                                        startIcon={<MiscellaneousServicesIcon fontSize="small" />}
                                        className="text-left"
                                        title="Ir para Cadastro"
                                        sx={{
                                            justifyContent: "flex-start",
                                            padding: "10px 16px",
                                            textTransform: "none",
                                            "&:hover": {
                                                backgroundColor: "#f4f4f4",
                                            },
                                        }}
                                    >
                                        Cadastro
                                    </Button>
                                    {showCadastroSubMenu && (
                                        <div>
                                            <Button
                                                fullWidth
                                                onClick={() => handleNavigate("/cadastro")}
                                                startIcon={<PersonIcon fontSize="small" />}
                                                className="text-left"
                                                title="Ir para Usuário"
                                                sx={{
                                                    justifyContent: "flex-start",
                                                    padding: "10px 50px",
                                                    textTransform: "none",
                                                    "&:hover": {
                                                        backgroundColor: "#f4f4f4",
                                                    },
                                                }}
                                            >
                                                Usuário
                                            </Button>
                                            <Button
                                                fullWidth
                                                onClick={() => handleNavigate("/cadastro-unidade")}
                                                startIcon={<LocationCityIcon fontSize="small" />}
                                                className="text-left"
                                                title="Ir para Unidade"
                                                sx={{
                                                    justifyContent: "flex-start",
                                                    padding: "10px 50px",
                                                    textTransform: "none",
                                                    "&:hover": {
                                                        backgroundColor: "#f4f4f4",
                                                    },
                                                }}
                                            >
                                                Unidade
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <Button
                                fullWidth
                                onClick={() => handleNavigate("/relatorio")}
                                startIcon={<BarChartIcon fontSize="small" />}
                                className="text-left"
                                title="Ir para Relatorio"
                                sx={{
                                    justifyContent: "flex-start",
                                    padding: "10px 16px",
                                    textTransform: "none",
                                    "&:hover": {
                                        backgroundColor: "#f4f4f4",
                                    },
                                }}
                            >
                                Relatório
                            </Button>
                        </List>
                    </div>
                </Drawer>
            </div>
        </div>
    );
};

export default Navbar;