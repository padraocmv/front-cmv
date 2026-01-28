import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import ButtonComponent from '../button';
import ClearIcon from '@mui/icons-material/Clear';
import Title from '../title';

const ModalComponent = ({ open, onClose, width = 400, title, content, onConfirm, confirmDisabled = false,
    confirmButton = true, confirmTitle = 'Confirmar', sx = {} }) => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: width,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        ...sx
    };

    return (
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className='flex justify-between'>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        <Title
                            conteudo={title}
                            fontSize={"18px"}
                            fontWeight={"700"}
                            color={"#006b33"}
                        />
                    </Typography>
                    <button className='text-red' title='Fechar' onClick={onClose}><ClearIcon /></button>
                </div>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {content}
                </Typography>
                <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                    {confirmButton &&
                        <ButtonComponent
                            title={confirmTitle}
                            onClick={onConfirm}
                            disabled={confirmDisabled}
                        />
                    }
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalComponent;
