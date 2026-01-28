import React from "react";
import './icone-button-navegacao.css';

const ButtonNavegacao = ({
  padding,
  alignItems,
  justifyContent,
  width,
  icon,
  title,
  funcao,
  fontSizeBotao,
  flexDirection,
  border,
  gap,
  display,
  iconEnd,
  fontWeight,
  borderRadius,
  imgSrc,
  imgAlt,
  imgWidth,
  imgHeight,
  label,
  color,
  borderColor,
  borderTopLeftRadius,
  backgroundColor,
  borderBottom,
}) => {
  return (
    <button
      onClick={funcao}
      title={label}
      className="button-custom"
      style={{
        gap: gap,
        padding: padding,
        justifyContent: justifyContent,
        alignItems: alignItems,
        display: display || 'flex',
        flexDirection: flexDirection,
        width: width,
        fontSize: fontSizeBotao,
        fontWeight: fontWeight || 500,
        border: border || `1px solid ${borderColor || '#006b33'}`,
        borderRadius: borderRadius || '5px',
        borderBottom: borderBottom ,
        borderTopLeftRadius: borderTopLeftRadius,
        backgroundColor: backgroundColor,
        color: color, 
      }}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt={imgAlt || "Button Image"}
          width={imgWidth || 24}
          height={imgHeight || 24}
        />
      )}
      {icon}
      {title}
      {iconEnd}
    </button>
  );
};

export default ButtonNavegacao;