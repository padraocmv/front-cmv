import React from 'react';

const Title = ({ conteudo, fontSize, color, fontWeight }) => {
  const estiloTitulo = {
    fontSize: fontSize,
    color: color,
    fontWeight: fontWeight 
  };

  return <h1 style={estiloTitulo}>{conteudo}</h1>;
};

export default Title;
