import React from 'react';
import './bt-component-associado.css';

export default function ButtonComponent({
    className = '',
    startIcon,
    endIcon,
    onClick,
    isActive,
    disabled,
    title,
    legenda,
    paddingX = '1rem',
    paddingY = '0.3rem',
    circular = false,
    backgroundColor,
}) {
    return (
        <button
            className={`button-associado ${className} ${isActive ? 'active-bt' : ''}`}
            onClick={onClick}
            disabled={disabled}
            title={legenda}
            style={{
                padding: circular ? paddingX : `${paddingY} ${paddingX}`,
                width: circular ? paddingX : 'auto',
                height: circular ? paddingX : 'auto',
                backgroundColor: backgroundColor,
            }}
        >
            {circular ? title : (
                <>
                    {startIcon && <span className="icon-start-bt">{startIcon}</span>}
                    {title}
                    {endIcon && <span className="icon-end-bt">{endIcon}</span>}
                </>
            )}
        </button>
    );
}
