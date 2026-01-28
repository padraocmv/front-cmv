import React from "react";

const Label = ({
  conteudo,
  fontSize,
  color,
  width,
  backgroundColor,
  fontWeight,
  marginLeft,
  display,
  justifyContent,
  gap,
  alignItems,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderRadius,
  icon,padding,
  marginTop,
  marginBottom,
  border,
  iconEnd,
}) => {
  const estiloTitulo = {
    width:width,
    borderRadius:borderRadius,
    border:border,
    marginLeft,
    marginTop,
    justifyContent:justifyContent,
    fontSize: fontSize,
    gap: "10px" || gap,
    marginBottom:marginBottom,
    alignItems:alignItems,
    display: "flex" || display,
    borderTopLeftRadius:borderTopLeftRadius,
    borderTopRightRadius: borderTopRightRadius,
    backgroundColor:backgroundColor,
    padding: padding,
    color: color,
    iconEnd:iconEnd,
    fontWeight: fontWeight,
  };

  return (
    <label style={estiloTitulo}>
      {icon} {conteudo} {iconEnd}
    </label>
  );
};

export default Label;
