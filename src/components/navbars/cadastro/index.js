import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ButtonComponent from '../../button';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import { ProductionQuantityLimitsTwoTone } from '@mui/icons-material';

const HeaderCadastro = () => {
    const navigate = useNavigate();

    
    const tipoUsuario = localStorage.getItem('tipo');

    const handleNavigation = (section) => {
        switch (section) {
            case 'usuario':
                navigate('/cadastro/usuario');
                break;
            case 'produto':
                navigate('/cadastro/produto');
                break;
            case 'unidade':
                navigate('/cadastro/unidade');
                break;
            case 'categoria':
                navigate('/cadastro/categoria');
                break;
            default:
                console.warn(`Seção desconhecida: ${section}`);
                break;
        }
    };

    return (
        <div className="w-[100%] items-center justify-center flex flex-wrap lg:justify-start md:gap-1">

            {tipoUsuario !== "2" && tipoUsuario !== "3" && (
                <ButtonComponent
                    startIcon={<AccountCircleIcon fontSize="small" />}
                    title="Usuário"
                    buttonSize="large"
                    onClick={() => handleNavigation('usuario')}
                    className="w-[35%] sm:w-[50%] md:w-[40%] lg:w-[100%]"
                />
            )}

            <ButtonComponent
                startIcon={<ProductionQuantityLimitsTwoTone fontSize="small" />}
                title="Produto"
                buttonSize="large"
                onClick={() => handleNavigation('produto')}
                className="w-[35%] sm:w-[50%] md:w-[40%] lg:w-[100%]"
            />

            {tipoUsuario !== "2" && tipoUsuario !== "3" && (
                <ButtonComponent
                    startIcon={<LocationOnIcon fontSize="small" />}
                    title="Unidade"
                    buttonSize="large"
                    onClick={() => handleNavigation('unidade')}
                    className="w-[35%] sm:w-[50%] md:w-[40%] lg:w-[100%]"
                />
            )}

            <ButtonComponent
                startIcon={<CategoryIcon fontSize="small" />}
                title="Categoria"
                buttonSize="large"
                onClick={() => handleNavigation('categoria')}
                className="w-[35%] sm:w-[50%] md:w-[40%] lg:w-[100%]"
            />
        </div>
    );
};

export default HeaderCadastro;