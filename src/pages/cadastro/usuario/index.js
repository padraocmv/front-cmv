import React, { useState, useEffect } from "react";
import Navbar from '../../../components/navbars/header';
import HeaderPerfil from '../../../components/navbars/perfil';
import ButtonComponent from '../../../components/button';
import HeaderCadastro from '../../../components/navbars/cadastro';
import TableComponent from '../../../components/table/index';
import CentralModal from '../../../components/modal-central';
import SelectTextFields from "../../../components/select";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Checkbox from '@mui/material/Checkbox';
import MenuMobile from "../../../components/menu-mobile";
import { headerUsuario } from "../../../entities/headers/header-usuarios";
import ModalLateral from "../../../components/modal-lateral";
import { Edit } from '@mui/icons-material';
import { formatCPF } from "../../../utils/functions";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import TableLoading from "../../../components/loading/loading-table/loading";

import { IconButton, InputAdornment, TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NotesIcon from '@mui/icons-material/Notes';
import { LocationOnOutlined, Password } from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from "../../../components/auth-context";
import CustomToast from "../../../components/toast";

const Usuario = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cadastroUsuario, setCadastroUsuario] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editandoUsuario, setEditandoUsuario] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnidades, setSelectedUnidades] = useState([]);
  const [cpf, setCpf] = useState('');
  const [userOptionsUnidade, setUserOptionsUnidade] = useState([]);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    nome: '',
    cpf: '',
    senha: '',
    funcao: '',
    unidade: '',
    permissoes: {
      administrador: false,
      geral: false,
      basico: false,
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };
  const handleCheckboxChange = (permissao) => {
    const updatedPermissoes = {
      administrador: permissao === 'administrador',
      geral: permissao === 'geral',
      basico: permissao === 'basico',
    };
    setNewUser({
      ...newUser,
      permissoes: updatedPermissoes,
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCadastroUsuario = () => setCadastroUsuario(true);
  const handleCloseCadastroUsuario = () => {
    setCadastroUsuario(false);
    setNewUser({
      nome: '',
      cpf: '',
      senha: '',
      funcao: '',
      unidade: '',
      permissoes: {
        administrador: false,
        basico: false,
      },
    });
    setSelectedUnidades([]);
  };

  const handleCloseEditUser = () => {
    setEditandoUsuario(false);
    setEditUser(null);
    setNewUser({
      nome: '',
      cpf: '',
      senha: '',
      unidade: '',
      permissoes: {
        administrador: false,
        basico: false,
      },
    });
    setSelectedUnidades([]);
  };

  const removeUnidade = (unidade) => {
    setSelectedUnidades(selectedUnidades.filter(item => item !== unidade));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (!newUser.nome) {
        return "O nome é obrigatório.";
      }
      if (!newUser.cpf) {
        return "O CPF é obrigatório.";
      }
      if (!newUser.senha) {
        return "A senha é obrigatória.";
      }
      if (selectedUnidades.length === 0) {
        return "Pelo menos uma unidade deve ser selecionada.";
      }

      const cpfExistente = users.find(user => user.cpf === newUser.cpf);
      if (cpfExistente) {
        return "CPF já cadastrado. Não é possível cadastrar outro.";
      }

      if (newUser.senha.length < 6) {
        return "A senha deve conter pelo menos 6 dígitos.";
      }

      const userData = {
        nome: newUser.nome,
        cpf: newUser.cpf,
        senha: newUser.senha,
        tipo: newUser.permissoes.administrador ? 1 : (newUser.permissoes.geral ? 2 : 3),
        unidadeId: selectedUnidades.map(unidade => {
          const unidadeObj = userOptionsUnidade.find(option => option.label === unidade);
          return unidadeObj ? unidadeObj.value : null;
        }).filter(id => id !== null),
      };

      const response = await api.post('/usuario', userData);

      if (response.status === 201) {
        const updatedUsers = [...users, response.data];
        setUsers(updatedUsers);
        handleCloseCadastroUsuario();
        return response.data.message || "Usuário cadastrado com sucesso!";
      } else {
        return response.data.message || "Erro ao cadastrar usuário!";
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "Credenciais inválidas" &&
        error.response.data.data === "Token de acesso inválido"
      ) {
        navigate("/");
      } else {
        return error.response?.data?.message || "Erro ao cadastrar usuário!";
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = (user) => {

    setEditUser(user);

    const permissoes = {
      administrador: user.tipo === "1",
      geral: user.tipo === "2",
      basico: user.tipo === "3",
    };


    setNewUser({
      nome: user.nome,
      cpf: formatCPF(user.cpf),
      senha: user.senha,
      funcao: user.funcao || '',
      unidade: user.unidade || '',
      permissoes: permissoes,
    });

    setSelectedUnidades(
      user.unidadeId.map((id) => {
        const unidadeObj = userOptionsUnidade.find((option) => option.value === id);
        return unidadeObj ? unidadeObj.label : null;
      }).filter((label) => label !== null)
    );
    setEditandoUsuario(true);
  };

  const handleUpdateUser = async () => {
    try {
      if (!newUser.nome) {
        CustomToast({ type: "error", message: "O nome é obrigatório." });
        return;
      }
      if (!newUser.cpf) {
        CustomToast({ type: "error", message: "O CPF é obrigatório." });
        return;
      }
      if (!newUser.senha) {
        CustomToast({ type: "error", message: "A senha é obrigatória." });
        return;
      }
      if (selectedUnidades.length === 0) {
        CustomToast({ type: "error", message: "Pelo menos uma unidade deve ser selecionada." });
        return;
      }
  
      const cpfExistente = users.find(user => user.cpf === newUser.cpf && user.cpf !== editUser.cpf);
      if (cpfExistente) {
        CustomToast({ type: "error", message: "CPF já cadastrado. Não é possível cadastrar outro." });
        return;
      }
  
      if (newUser.senha.length < 6) {
        CustomToast({ type: "error", message: "A senha deve conter pelo menos 6 dígitos." });
        return;
      }
  
      const userData = {
        nome: newUser.nome,
        cpf: newUser.cpf,
        senha: newUser.senha,
        tipo: newUser.permissoes.administrador ? "1" : 
              (newUser.permissoes.geral ? "2" : "3"),
        unidadeId: selectedUnidades.map(unidade => {
          const unidadeObj = userOptionsUnidade.find(option => option.label === unidade);
          return unidadeObj ? unidadeObj.value : null;
        }).filter(id => id !== null),
      };
  
      const response = await api.put(`/usuario/${editUser.id}`, userData);

  
      if (response.data.status) { 
        CustomToast({ type: "success", message: response.data.message });
  
        const updatedUsers = users.map(user => {
          if (user.id === editUser.id) {
            return { 
              ...user, 
              ...response.data.data, 
              unidadeId: response.data.data.unidadeId 
            };
          }
          return user;
        });
  
        setUsers(updatedUsers);
        handleCloseEditUser(); 
        
        if (editUser.id === userId) {
          navigate("/login");
        }
      } else {
        CustomToast({ type: "error", message: response.data.message || "Erro ao atualizar usuário!" });
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      CustomToast({ 
        type: "error", 
        message: error.response?.data?.message || "Erro ao atualizar usuário!" 
      });
    }
  };
  const handleCPFChange = (e) => {
    const formattedCPF = formatCPF(e.target.value);
    setCpf(formattedCPF);
    setNewUser({ ...newUser, cpf: formattedCPF });
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/usuario');
      const usersWithActiveState = response.data.data.map(user => ({
        ...user,
        isActive: true
      }));
      setUsers(usersWithActiveState);
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "Credenciais inválidas" &&
        error.response.data.data === "Token de acesso inválido"
      ) {
        navigate("/");
      } else {
        return error.response?.data?.message || "Erro ao buscar usuários!";
      }
    }
  };
  const handleInactiveUser = async (user) => {
    try {
      const response = await api.delete(`/usuario/${user.id}`);
      if (response.status === 200) {
        const updatedUsers = users.map(u => {
          if (u.id === user.id) {
            return { ...u, isAtivo: !u.isAtivo };
          }
          return u;
        });
        setUsers(updatedUsers);
        CustomToast({ type: "success", message: response.data.message });
      }
    } catch (error) {
      CustomToast({ type: "error", message: error.response?.data?.message });
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter(user =>
      user && typeof user === 'object' && (user.nome || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const handleUnidadeChange = (event) => {
    const selectedValue = event.target.value;
    const unidadeObj = userOptionsUnidade.find(option => option.value === selectedValue);
    if (unidadeObj && !selectedUnidades.includes(unidadeObj.label)) {
      setSelectedUnidades([...selectedUnidades, unidadeObj.label]);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      const response = await api.delete(`/usuario/${user.id}`);
      if (response.status === 200) {
        const updatedUsers = users.filter(u => u.id !== user.id);
        setUsers(updatedUsers);
        return response.data.message || "Usuário excluído com sucesso!";
      } else {
        return "Erro ao excluir usuário!";
      }
    } catch (error) {
      return error.response?.data?.message || "Erro ao excluir usuário!";
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

  const rows = filteredUsers.map(user => {
    const unidadeNames = Array.isArray(user.unidadeId) ? user.unidadeId.map(id => {
      const unidadeObj = userOptionsUnidade.find(option => option.value === id);
      return unidadeObj ? unidadeObj.label : "Unidade Desconhecida";
    }) : [];

    return {
      ...user,
      unidade: unidadeNames.join(", ") || "Unidade Desconhecida",
      tipoDisplay: user.tipo === "1" ? "Administrador" : user.tipo === "2" ? "Geral" : "Básico",
      edit: () => handleEditUser(user),
      delete: () => handleDeleteUser(user),
      status: user.isAtivo ? "Ativado" : "Inativado",
      toggleStatus: () => handleInactiveUser(user),
    };
  });

  useEffect(() => {
    carregarUnidades();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex w-full ">
      <Navbar />
      <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-0 lg:ml-2'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='justify-center  md:justify-center lg:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2 '>
          <AccountCircleIcon />Usuário
        </h1>
        <div className=" items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
          <div className="hidden lg:w-[14%] lg:flex  ">
            <HeaderCadastro />
          </div>
          <div className="w-[100%]  itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col lg:w-[80%]">
            <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Buscar usuário"
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: { xs: '72%', sm: '50%', md: '40%', lg: '40%' }, }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <ButtonComponent
                startIcon={<AddCircleOutlineIcon fontSize='small' />}
                title={'Cadastrar'}
                subtitle={'Cadastrar'}
                buttonSize="large"
                onClick={handleCadastroUsuario}
              />
            </div>
            <div className="w-[97%] ml-0 sm:ml-0 ">
              {filteredUsers.length === 0 ? (
                <div className="flex w-full flex-col items-center justify-center gap-5 h-96">
                  <TableLoading />
                  <label className="text-sm">Não foi encontrado um usuário com esse nome!</label>
                </div>
              ) : (
                <TableComponent
                  headers={headerUsuario}
                  rows={rows}
                  actionsLabel={"Ações"}
                  actionCalls={{
                    edit: (user) => handleEditUser(user),
                    inactivate: (user) => handleInactiveUser(user),
                  }}
                />
              )}
            </div>

            <CentralModal
              tamanhoTitulo={'81%'}
              maxHeight={'90vh'}
              top={'20%'}
              left={'28%'}
              width={'620px'}
              icon={<AddCircleOutlineIcon fontSize="small" />}
              open={cadastroUsuario}
              onClose={handleCloseCadastroUsuario}
              title="Cadastrar Usuário"
            >
              <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                <div className='mt-4 flex gap-3 flex-wrap'>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nome Completo"
                    name="nome"
                    value={newUser.nome}
                    onChange={handleInputChange}
                    autoComplete="off"
                    sx={{ width: { xs: '100%', sm: '50%', md: '40%', lg: '47%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="CPF"
                    name="cpf"
                    value={cpf}
                    onChange={handleCPFChange}
                    autoComplete="off"
                    sx={{ width: { xs: '48%', sm: '43%', md: '45%', lg: '47%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NotesIcon />
                        </InputAdornment>
                      ),
                      inputProps: {
                        maxLength: 11,
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Senha"
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    value={newUser.senha}
                    onChange={handleInputChange}
                    autoComplete="off"
                    sx={{ width: { xs: '48%', sm: '40%', md: '40%', lg: '47%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Password />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <SelectTextFields
                    width={'260px'}
                    icon={<LocationOnOutlined fontSize="small" />}
                    label={'Unidade'}
                    backgroundColor={"#D9D9D9"}
                    name={"unidade"}
                    fontWeight={500}
                    options={userOptionsUnidade}
                    onChange={handleUnidadeChange}
                  />
                </div>
                <div className='mt-4 w-[96%]'>
                  <h3 className="text-xs">Unidades Selecionadas:</h3>
                  <ul className="flex flex-col gap-1">
                    {selectedUnidades.map((unidade, index) => (
                      <li key={index} className="flex justify-between border-[1px] p-2 rounded-lg text-xs ">
                        {unidade}
                        <button style={{ color: 'red' }} onClick={() => removeUnidade(unidade)} className="text-red-500 ">
                          <HighlightOffIcon fontSize="small" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-full flex items-center mt-4 ml-2 font-bold mb-1">
                  <label className="w-[70%] text-xs">Permissão</label>
                </div>

                <div className="w-[96%] border-[1px] p-2 rounded-lg">
                  {Object.keys(newUser.permissoes).map((permissao) => (
                    <div className="w-full flex items-center" key={permissao}>
                      <div className="w-[12%]">
                        <Checkbox
                          checked={newUser.permissoes[permissao]}
                          onChange={() => handleCheckboxChange(permissao)}
                        />
                      </div>
                      <label className="text-xs w-[73%]">
                        {permissao === 'administrador' ? 'Administrador' :
                          permissao === 'geral' ? 'Geral' :
                            'Básico'}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex w-[96%] items-end justify-end mt-2 ">
                  <ButtonComponent
                    startIcon={<AddCircleOutlineIcon fontSize='small' />}
                    title={'Cadastrar'}
                    subtitle={'Cadastrar'}
                    buttonSize="large"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </CentralModal>

            <ModalLateral
              open={editandoUsuario}
              handleClose={handleCloseEditUser}
              tituloModal="Editar Usuário"
              icon={<Edit />}
              tamanhoTitulo="75%"
              conteudo={
                <div className="  max-h-[500px]">
                  <div className='mt-4 flex gap-3 flex-wrap'>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Nome Completo"
                      name="nome"
                      value={newUser.nome}
                      onChange={handleInputChange}
                      autoComplete="off"
                      sx={{ width: { xs: '100%', sm: '50%', md: '40%', lg: '47%' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="CPF"
                      name="cpf"
                      value={newUser.cpf}
                      onChange={handleCPFChange}
                      autoComplete="off"
                      sx={{ width: { xs: '48%', sm: '45%', md: '40%', lg: '47%' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <NotesIcon />
                          </InputAdornment>
                        ),
                        inputProps: {
                          maxLength: 11,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Senha"
                      name="senha"
                      type={showPassword ? "text" : "password"}
                      value={newUser.senha}
                      onChange={handleInputChange}
                      autoComplete="off"
                      sx={{ width: { xs: '47%', sm: '50%', md: '40%', lg: '47%' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Password />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <SelectTextFields
                      width={'260px'}
                      icon={<LocationOnOutlined fontSize="small" />}
                      label={'Unidade'}
                      backgroundColor={"#D9D9D9"}
                      name={"unidade"}
                      fontWeight={500}
                      options={userOptionsUnidade}
                      onChange={handleUnidadeChange}
                    />
                  </div>
                  <div className='mt-4 w-[96%]'>
                    <h3 className="text-xs">Unidades Selecionadas:</h3>
                    <ul className="flex flex-col gap-1">
                      {selectedUnidades.map((unidade, index) => (
                        <li key={index} className="flex justify-between border-[1px] p-2 rounded-lg text-xs ">
                          {unidade}
                          <button style={{ color: 'red' }} onClick={() => removeUnidade(unidade)} className="text-red-500 ">
                            <HighlightOffIcon fontSize="small" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="w-full flex items-center mt-4 ml-2 font-bold mb-1">
                    <label className="w-[70%] text-xs">Permissão</label>
                  </div>

                  <div className="w-[96%] border-[1px] p-2 rounded-lg">
                    <div className="w-full flex items-center">
                      <div className="w-[12%]">
                        <Checkbox
                          checked={newUser.permissoes.administrador}
                          onChange={() => handleCheckboxChange('administrador')}
                        />
                      </div>
                      <label className="text-xs w-[73%]">Administrador</label>
                    </div>
                    <div className="w-full flex items-center">
                      <div className="w-[12%]">
                        <Checkbox
                          checked={newUser.permissoes.geral}
                          onChange={() => handleCheckboxChange('geral')}
                        />
                      </div>
                      <label className="text-xs w-[73%]">Geral</label>
                    </div>
                    <div className="w-full flex items-center">
                      <div className="w-[12%]">
                        <Checkbox
                          checked={newUser.permissoes.basico}
                          onChange={() => handleCheckboxChange('basico')}
                        />
                      </div>
                      <label className="text-xs w-[73%]">Básico</label>
                    </div>
                  </div>
                  <div className="flex w-[96%] items-end justify-end mt-2 ">
                    <ButtonComponent
                      startIcon={<AddCircleOutlineIcon fontSize='small' />}
                      title={'Salvar'}
                      subtitle={'Salvar'}
                      buttonSize="large"
                      onClick={handleUpdateUser}
                    />
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usuario;