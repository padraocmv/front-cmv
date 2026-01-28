import { Navigate, Outlet, useLocation } from 'react-router-dom';
import CustomToast from '../components/toast';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');
    const tipoUsuario = localStorage.getItem('tipo');
    const location = useLocation();

    if (!token) {
        CustomToast({ type: 'warning', message: 'Faça login para acessar esta página!' });
        return <Navigate to="/" replace />;
    }

    if (tipoUsuario === "2" && location.pathname === "/entrada-saida") {
        CustomToast({ type: 'warning', message: 'Você não tem permissão para acessar esta página!' });
        return <Navigate to="/dashboard" replace />;
    }

    if (tipoUsuario === "2" && (location.pathname === "/cadastro/unidade" || location.pathname === "/cadastro/usuario")) {
        CustomToast({ type: 'warning', message: 'Você não tem permissão para acessar esta página!' });
        return <Navigate to="/dashboard" replace />;
    }

    const rotasRestritasTipo3 = [
        "/cmv",
        "/ficha-tecnica",
        "/cadastro/usuario",
        "/cadastro/unidade"
    ];

    if (tipoUsuario === "3" && rotasRestritasTipo3.includes(location.pathname)) {
        CustomToast({ type: 'warning', message: 'Você não tem permissão para acessar esta página!' });
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;