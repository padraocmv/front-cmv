import React from "react";
import "./bt-table-associado.css";

const ButtonTable = ({
    title,
    funcao,
    legenda,
    className
}) => {
    return (
        <button onClick={funcao} className={`bt-associado-icon ${className}`} title={legenda}>
            <span className="conteudo-botao">{title}</span>
        </button>
    );
};

export default ButtonTable;
