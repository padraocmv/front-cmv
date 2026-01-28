import React, { useEffect, useState } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from "@mui/icons-material/Menu";
import { ExitToApp } from '@mui/icons-material';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import AddchartIcon from '@mui/icons-material/Addchart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Estoque from '../../assets/png/logo.png';
import SelectTextFields from '../select';
import { useUnidade } from "../unidade-context";

const MenuMobile = () => {
    const { unidades, setUnidadeId, setUnidadeNome, unidadeId } = useUnidade();
    const [selectedUnidade, setSelectedUnidade] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    const tipoUsuario = localStorage.getItem('tipo');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (route) => {
        navigate(route);
        handleClose();
    };

    const handleUnidadeChange = (event) => {
        const selectedValue = event.target.value;
        const unidadeObj = unidades.find(option => option.id === selectedValue);

        if (unidadeObj) {
            setUnidadeId(unidadeObj.id);
            setUnidadeNome(unidadeObj.nome);
            localStorage.setItem('unidadeId', unidadeObj.id);
            localStorage.setItem('unidadeNome', unidadeObj.nome);


            window.location.reload();
        }
    };



    useEffect(() => {
        setSelectedUnidade(unidadeId);
    }, [unidadeId]);

    useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    return (
        <div className='w-[100%]  flex items-center justify-center p-3 gap-10  z-30  lg:hidden' style={{ backgroundColor: 'black' }}>
            <div className='flex items-start w-[30%] md:mr-8'>
                <img style={{ width: '100%', marginRight: '150px', padding: '10px' }} src={Estoque} alt="Total de Produtos" />
            </div>
            <div className="w-[42%] md:w-[25%] sm:mr-0 lg:w-[25%] md:mr-6 justify-center flex p-2 bg-white rounded-md">

                <SelectTextFields
                    width={'150px'}
                    icon={<LocationOnIcon fontSize="small" />}
                    label={'Unidades'}
                    backgroundColor={"#D9D9D9"}
                    name={"Unidades"}
                    fontWeight={500}
                    options={unidades.map(unidade => ({ value: unidade.id, label: unidade.nome }))}
                    value={selectedUnidade}
                    onChange={handleUnidadeChange}
                />
            </div>
            <div className='flex items-start w-[20%] sm:w-[10%] md:w-[15%] '>
                <button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    style={{ backgroundColor: '#BCDA72', color: 'black', borderRadius: '5px', width: '100%' }}
                >
                    <MenuIcon fontSize='small' />
                </button>
            </div>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => handleNavigate("/dashboard")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <DashboardIcon style={{ color: '#BCDA72' }} fontSize='small' />Dashboard
                </MenuItem>
                {tipoUsuario !== "3" && (
                    <MenuItem onClick={() => handleNavigate("/cmv")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                        <AddToQueueIcon style={{ color: '#BCDA72' }} fontSize='small' />CMV
                    </MenuItem>
                )}
                {tipoUsuario !== "3" && (
                    <MenuItem onClick={() => handleNavigate("/ficha-tecnica")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                        <ContentPasteSearchIcon style={{ color: '#BCDA72' }} fontSize='small' />Ficha Técnica
                    </MenuItem>
                )}
                <MenuItem onClick={() => handleNavigate("/entrada-saida")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <AddchartIcon style={{ color: '#BCDA72' }} fontSize='small' />Entrada/Saída
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/relatorio")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <DataThresholdingIcon style={{ color: '#BCDA72' }} fontSize='small' />Relatório
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/cadastro")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <MiscellaneousServicesIcon style={{ color: '#BCDA72' }} fontSize='small' />Cadastro
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <ExitToApp style={{ color: '#BCDA72' }} fontSize='small' />Sair
                </MenuItem>
            </Menu>
        </div>
    );
}

export default MenuMobile;