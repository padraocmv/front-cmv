import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/login';
import Dashboard from '../pages/dashboard';
import Produtos from '../pages/cadastro/produtos/index.js';
import Cadastro from '../pages/cadastro/index.js';
import Categoria from '../pages/cadastro/categoria/index.js';
import EntradaSaida from '../pages/entrada-saida/index.js';
import CMV from '../pages/cmv/index.js';
import Relatorio from '../pages/relatorio/index.js';
import FichaTecnica from '../pages/ficha-tecnica/index.js';
import EstoqueReal from '../pages/relatorio/estoque-real/index.js'
import Usuario from '../pages/cadastro/usuario/index.js';
import Unidades from '../pages/cadastro/unidades/index.js';
import ListaCompra from '../pages/relatorio/lista-compra/index.js';
import Desperdicio from '../pages/relatorio/desperdico/index.js';
import PrivateRoute from './private-routes.js';

const AppRoutes = ({ user }) => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            
            <Route element={<PrivateRoute user={user} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/entrada-saida" element={<EntradaSaida />} />
                <Route path="/cmv" element={<CMV />} />
                <Route path="/relatorio" element={<Relatorio />} />
                <Route path="/relatorio/estoque-real" element={<EstoqueReal />} />
                <Route path="/relatorio/lista-compra" element={<ListaCompra />} />
                <Route path="/relatorio/desperdicio" element={<Desperdicio />} />
                <Route path="/ficha-tecnica" element={<FichaTecnica />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/cadastro/categoria" element={<Categoria />} />
                <Route path="/cadastro/usuario" element={<Usuario />} />
                <Route path="/cadastro/produto" element={<Produtos />} />
                <Route path="/cadastro/unidade" element={<Unidades />} />
            </Route>

        </Routes>
    );
};

export default AppRoutes;
