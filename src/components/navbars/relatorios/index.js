import React from 'react';
import ButtonComponent from '../../button';
import { useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssignmentIcon from '@mui/icons-material/Assignment';

const HeaderRelatorio = () => {
    const navigate = useNavigate();

    const tipoUsuario = localStorage.getItem('tipo');

    const handleNavigation = (section) => {
        switch (section) {
            case 'estoque-real':
                navigate('/relatorio/estoque-real');
                break;
            case 'lista-compra':
                navigate('/relatorio/lista-compra');
                break;
            // case 'desperdicio': // Aqui estava 'usuario', mas o botão chama 'usuarios'
            //     navigate('/relatorios/desperdicio');
            //     break;
            default:
                console.warn(`Seção desconhecida: ${section}`);
                break;
        }
    };


    return (
        <div className="w-[100%] items-center justify-center flex flex-wrap  lg:justify-start md: gap-1 ">
            <ButtonComponent
                startIcon={<BarChartIcon fontSize="small" />}
                title="Estoque Real"
                buttonSize="large"
                onClick={() => handleNavigation('estoque-real')}
                className="w-[35%] sm:w-[50%] md:w-[25%] lg:w-[100%]"

            />
          
                <ButtonComponent
                    startIcon={<AssignmentIcon fontSize="small" />}
                    title="Lista de Compra"
                    buttonSize="large"
                    onClick={() => handleNavigation('lista-compra')}
                    className="w-[40%] sm:w-[50%]  md:w-[25%] lg:w-[100%]"

                />
           
            {/* <ButtonComponent
                startIcon={<DeleteForeverIcon fontSize="small" />}
                title="Desperdício"
                buttonSize="large"
                onClick={() => handleNavigation('desperdicio')}
                className="w-[40%] sm:w-[50%] md:w-[100%]"

            /> */}


        </div>
    );
};

export default HeaderRelatorio;
