import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ClearIcon from '@mui/icons-material/Clear';
import { Modal, Box, Menu, MenuItem, Typography } from "@mui/material";
import Title from "../../title";
import ButtonComponent from "../../button";
import SelectTextFields from "../../select";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LogoutIcon from '@mui/icons-material/Logout';
import CustomToast from "../../toast";
import { useUnidade } from "../../unidade-context";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

const HeaderPerfil = () => {
  const { unidades, setUnidadeId, setUnidadeNome, unidadeId } = useUnidade();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedUnidade, setSelectedUnidade] = useState('');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenLogoutConfirm = () => setOpenLogoutConfirm(true);
  const handleCloseLogoutConfirm = () => setOpenLogoutConfirm(false);

  const confirmLogout = async () => {
    handleCloseLogoutConfirm();
    localStorage.clear();
    navigate("/");
    CustomToast({ type: "success", message: "Logout realizado com sucesso!" });
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
    <>
      <div className="hidden lg:flex justify-end w-full h-8">
        <div
          className="flex items-center justify-between pl-3 pr-4 w-[40%] h-20 bg-cover bg-no-repeat rounded-bl-lg"
          style={{ backgroundColor: '#BCDA72' }}
        >
          <div className="w-[100%] items-star flex flex-wrap gap-4 p-2">
            <div className="w-[53%] p-2 bg-white rounded-md flex justify-center"> 
              <SelectTextFields
                width={'150px'}
                icon={<LocationOnIcon fontSize="small" />}
                label={'Unidades'}
                backgroundColor={"#D9D9D9"}
                borderRadius={'5px'}
                name={"Unidades"}
                fontWeight={500}
                options={unidades.map(unidade => ({ value: unidade.id, label: unidade.nome }))}
                value={selectedUnidade}
                onChange={handleUnidadeChange}
              />
            </div>

            <div className=" w-[30%]flex items-center mt-3 justify-start text-black gap-2">
              <a className="cursor-pointer p-1">
                <AccountCircleIcon />
              </a>
              <span className="text-xs text-black font-bold">{userName || "Usuário"}</span>
            </div>
          </div>
          <div className="w-[10%] flex justify-center items-center" style={{ backgroundColor: 'white', borderRadius: '50px', padding: '8px', marginLeft: '16px' }}> {/* Adicionei marginLeft para espaçamento */}
            <a onClick={handleMenuOpen} className="cursor-pointer p-1">
              <LogoutIcon />
            </a>
          </div>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className="p-4"
      >
        <MenuItem onClick={handleOpenLogoutConfirm} title="Sair do sistema" className="flex items-center gap-2">
          <LogoutIcon fontSize="small" className="text-red" /> Sair
        </MenuItem>
      </Menu>
      <Modal
        open={openLogoutConfirm}
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-description"
      >
        <Box sx={style}>
          <div className='flex justify-between'>
            <Typography id="logout-modal-title" variant="h6" component="h2">
              <Title
                conteudo={"Confirmação de Logout"}
                fontSize={"18px"}
                fontWeight={"700"}
                color={"black"}
              />
            </Typography>
            <button className='text-red' title="Fechar" onClick={handleCloseLogoutConfirm}><ClearIcon /></button>
          </div>
          <Typography id="logout-modal-description" sx={{ mt: 2 }}>
            <Title
              conteudo={"Tem certeza de que deseja sair?"}
              fontSize={"15px"}
              fontWeight={"500"}
            />
          </Typography>
          <div className="flex gap-2 justify-end mt-4">
            <ButtonComponent
              subtitle={"Confirmar Logout"}
              title={"SIM"}
              onClick={confirmLogout}
            />
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default HeaderPerfil;