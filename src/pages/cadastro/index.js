import React, { useEffect, useState } from 'react';
import MenuMobile from '../../components/menu-mobile';
import HeaderPerfil from '../../components/navbars/perfil';
import Navbar from '../../components/navbars/header';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import HeaderCadastro from '../../components/navbars/cadastro';
import CadastroImagem from '../../assets/png/cadas.png';

const Cadastro = () => {
    const [efeito, setEfeito] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setEfeito(true);
        }, 100);
    
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex ml-0 flex-col gap-3 w-full items-end sm:ml-0 lg:ml-2'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='justify-center  md:justify-center lg:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2 '>
                    <MiscellaneousServicesIcon />Cadastro
                </h1>
                <div className=" items-center justify-center lg:justify-start w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
                    <div className='w-[100%] md:w-[60%] lg:w-[14%]'>
                        <HeaderCadastro />
                    </div>
                  <div className={`w-[100%] lg:w-[80%] flex-col flex items-center justify-center transition-opacity duration-500 ${efeito ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <img className='w-[30%]' src={CadastroImagem} alt="Cadastro" />
                        <h1 className='font-bold text-primary'>Selecione uma opção do menu!</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cadastro;