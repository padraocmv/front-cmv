import React from "react";

const IconesBotoes = ({
  padding,
  alignItems,
  justifyContent,
  width,
  icon,
  funcao,
  gap,
  display,
  borderRadius,
  cursor,
  label,
  color,
  backgroundColor
}) => {
  return (
    <button
      onClick={funcao}
      title={label}
      style={{
        gap: gap,
        padding: padding,
        justifyContent: justifyContent,
        cursor:'pointer',
        alignItems: alignItems,
        display: display || 'flex',
        alignItems:alignItems,
        width: width,
        borderRadius: borderRadius,
        backgroundColor:backgroundColor,
        color: color ,
      }}
    >
      {icon}
    </button>
  );
};

export default IconesBotoes;
