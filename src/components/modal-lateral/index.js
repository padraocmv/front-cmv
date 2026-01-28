import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Slide from '@mui/material/Slide';
import Lines from '../lines';
import Label from '../label';
import ButtonClose from '../buttons/button-close';

const style = (width) => ({
    position: 'absolute',
    top: 0, 
    right: 0,
    width: width || 400, 
    height: '100vh', 
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    borderTopLeftRadius: '16px',
    display: 'flex',
    flexDirection: 'column', 
});

export default function ModalLateral({ open, handleClose, tituloModal, conteudo, icon, width, tamanhoIcone, tamanhoTitulo, opcao, tamanhoOpcao }) {
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                }}
            >
                <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                    <Box sx={style(width)}>
                        <Lines display={'flex'} flexDirection={'column'} width={'100%'} height={'100%'} conteudo={
                            <>
                           
                                <Lines width={'100%'} display={'flex'} alignItems={'center'} conteudo={
                                    <>
                                        <Lines width={tamanhoIcone || '10%'} alignItems={'center'} justifyContent={'center'} padding={'5px'} backgroundColor={'#b0d847'} borderRadius={'5px'} color={'#ffff'} conteudo={<>{icon}</>} />
                                        <Label fontSize={'15px'} color={'black'} width={tamanhoTitulo} fontWeight={'700'} conteudo={tituloModal} />
                                        <Lines width={tamanhoOpcao || '0%'} display={'flex'} alignItems={'center'} justifyContent={'center'} conteudo={opcao} />
                                        <ButtonClose funcao={handleClose} />
                                    </>
                                } />

                               
                                <Lines
                                    overflowY={'scroll'}
                                    flex={1} 
                                    width={'100%'}
                                    border={'1px solid #d9d9d9'}
                                    borderRadius={'10px'}
                                    padding={'10px'}
                                    marginTop={'10px'} 
                                    conteudo={<>{conteudo}</>}
                                />
                            </>
                        } />
                    </Box>
                </Slide>
            </Modal>
        </div>
    );
}