import React from "react";
import './button-header.css';

const ButtonHeader = ({
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
  gap,
  display,
  iconEnd,
  borderRadius,
  imgSrc,
  imgAlt,
  imgWidth,
  imgHeight,
  label,
  active, 
}) => {
  return (
    <button
      onClick={funcao}
      title={label}
      className={`button-custom-header ${active ? 'active' : ''}`} 
      style={{
        gap: gap,
        padding: padding,
        justifyContent: justifyContent,
        alignItems: alignItems,
        display: display || 'flex',
        flexDirection: flexDirection,
        width: width,
        fontSize: fontSizeBotao,
        fontWeight: fontWeightBotao || 500,
        borderRadius: borderRadius || '5px',
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

export default ButtonHeader;