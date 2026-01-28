import React from "react";
import './icone-button-venda.css';

const ButtonIconTextoStart = ({
  padding,
  alignItems,
  justifyContent,
  width,
  icon,
  title,
  funcao,
  fontSizeBotao,
  fontWeightBotao,
  flexDirection,
  border,
  gap,
  display,
  iconEnd,
  borderRadius,
  imgSrc,
  imgAlt,
  imgWidth,
  imgHeight,
  label,
  color,
  borderColor,
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
        fontWeight: fontWeightBotao || 700,
        border: border || `1px solid ${borderColor || '#006b33'}`,
        borderRadius: borderRadius || '5px',
        color: color ,
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

export default ButtonIconTextoStart;
