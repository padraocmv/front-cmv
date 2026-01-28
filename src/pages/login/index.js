
import React, { useState } from 'react';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import logoPaxVerde from '../../assets/png/logo.png';
import LoadingLogin from '../../components/loading/loading-login';
import { useNavigate } from 'react-router-dom';
import packageJson from '../../../package.json';
import CustomToast from '../../components/toast';
import { formatCPF } from '../../utils/formatCPF';
import './login.css';
import api from '../../services/api';
import { useUnidade } from '../../components/unidade-context';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setUnidadeId, setUnidadeNome, atualizarUnidades } = useUnidade();
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleCPFChange = (e) => {
        const { value } = e.target;
        if (value.length <= 14) {
            setCpf(formatCPF(value));
        }
    };

    const handleSenhaChange = (e) => {
        setSenha(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            logar();
        }
    };

    const logar = async () => {
        if (!cpf) {
            CustomToast({ type: 'warning', message: 'Informe o CPF!' });
            return;
        }
        if (!senha) {
            CustomToast({ type: 'warning', message: 'Informe sua senha!' });
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await api.post('/login', { cpf, senha });
    
          
            if (response.data.message && (response.data.message === "Usuário não encontrado" || 
                                        response.data.message === "Senha inválida")) {
                CustomToast({ type: 'error', message: response.data.message });
                setLoading(false);
                return;
            }
    
            const { token, nome, unidade, tipo } = response.data.data;
    
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('userName', nome);
                localStorage.setItem('tipo', tipo);
    
                if (unidade && unidade.length > 0) {
                    const unidadeSelecionada = unidade[0];
                    setUnidadeId(unidadeSelecionada.id);
                    setUnidadeNome(unidadeSelecionada.nome);
                    localStorage.setItem('unidadeId', unidadeSelecionada.id);
                    localStorage.setItem('unidadeNome', unidadeSelecionada.nome);
                }
                atualizarUnidades(unidade);
                CustomToast({ type: 'success', message: `Bem-vindo(a), ${nome}` });
                setTimeout(() => {
                    setCpf('');
                    setSenha('');
                    setLoading(false);
                    navigate('/dashboard');
                }, 1000);
            } else {
                CustomToast({ type: 'error', message: 'Erro ao receber o token de autenticação.' });
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            if (error.response) {
              
                if (error.response.data && error.response.data.message) {
                    CustomToast({ type: 'error', message: error.response.data.message });
                } 
              
                else if (error.response.status === 401) {
                    CustomToast({ type: 'warning', message: 'Usuário inativo. Contate o administrador.' });
                } 
             
                else {
                    CustomToast({ type: 'error', message: 'Erro ao tentar fazer login. Tente novamente.' });
                }
            } else {
                CustomToast({ type: 'error', message: 'Erro de conexão. Verifique sua internet.' });
            }
        }
    };
    return (
        <div className="login-container flex h-screen items-center justify-center ">
            <div className="relative bg-black p-8 rounded-lg shadow-lg max-w-md w-full z-10">
                <div className="flex justify-center mb-10">
                    <img src={logoPaxVerde} alt="Logo Pax Verde" className="w-28" />
                </div>
                <input
                    type="text"
                    value={cpf}
                    onChange={handleCPFChange}
                    onKeyDown={handleKeyDown}
                    placeholder="CPF"
                    autoComplete='off'
                    className="cpf-input w-full p-3 mb-4 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="relative w-full mb-4">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={senha}
                        onChange={handleSenhaChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Senha"
                        className="password-input w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer opacity-25"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <VisibilityOffOutlined size={24} /> : <VisibilityOutlined size={24} />}
                    </div>
                </div>
                <button
                    onClick={logar}
                    style={{ backgroundColor: '#9EBB51' }}
                    className="login-button w-full text-white p-2 rounded-md bg-custom-green"
                >
                    {loading ? <LoadingLogin /> : 'Entrar'}
                </button>
                <div className="tutorial text-center mt-3" style={{ color: '#9EBB51' }}>
                   
                </div>
                <div className="versao-app text-center text-white mt-10">
                    <p> Versão {packageJson.version}</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;