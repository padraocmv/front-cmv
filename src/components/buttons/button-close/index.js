import React from "react";
import './icone-button-close.css';
import CloseIcon from '@mui/icons-material/Close';

const ButtonClose = ({
  alignItems,
  width,
  funcao,
  fontSizeBotao,
  fontWeightBotao,
  flexDirection,
  border,
  gap,
  marginTop,
  padding,
  display,
}) => {
  return (
    <button
      title="Fechar"
      onClick={funcao}
      className="button-custom-close"
      style={{
        gap: gap,
        padding: padding || '10px',
        justifyContent: 'end',
        width: width,
        alignItems: alignItems,
        display: display || 'flex',
        flexDirection: flexDirection,
        fontSize: fontSizeBotao,
        fontWeight: fontWeightBotao || 500,
        borderRadius: '50px',
        marginTop: marginTop,
        border:border,
      }}
    >
      <CloseIcon fontSize={"small"} />
    </button>
  );
};

export default ButtonClose;