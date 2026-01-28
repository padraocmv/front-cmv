
import React, { createContext, useContext, useState,  } from 'react';

const UnidadeContext = createContext();

export const UnidadeProvider = ({ children }) => {
    const [unidadeId, setUnidadeId] = useState(() => {
        const storedUnidadeId = localStorage.getItem('unidadeId');
        return storedUnidadeId && storedUnidadeId !== 'undefined' ? JSON.parse(storedUnidadeId) : null;
    });
    const [unidadeNome, setUnidadeNome] = useState(() => {
        const storedUnidadeNome = localStorage.getItem('unidadeNome');
        return storedUnidadeNome && storedUnidadeNome !== 'undefined' ? storedUnidadeNome : '';
    });
    const [unidades, setUnidades] = useState(() => {
        const storedUnidades = localStorage.getItem('unidades');
        return storedUnidades && storedUnidades !== 'undefined' ? JSON.parse(storedUnidades) : [];
    });

    const atualizarUnidade = (id, nome) => {
        setUnidadeId(id);
        setUnidadeNome(nome);
        localStorage.setItem('unidadeId', JSON.stringify(id));
        localStorage.setItem('unidadeNome', nome);
    };

    const atualizarUnidades = (unidades) => {
        setUnidades(unidades);
        localStorage.setItem('unidades', JSON.stringify(unidades)); 
    };

    return (
        <UnidadeContext.Provider value={{ unidadeId, unidadeNome, unidades, setUnidadeId: atualizarUnidade, setUnidadeNome, atualizarUnidades }}>
            {children}
        </UnidadeContext.Provider>
    );
};

export const useUnidade = () => {
    return useContext(UnidadeContext);
};