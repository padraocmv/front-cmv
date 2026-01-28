import React from 'react';

export default function ButtonComponent({
    className = '',
    startIcon,
    endIcon,
    fontWeight = 'semibold',
    fontSize = 'sm', 
    textAlign = 'center',
    onClick,
    isActive,
    disabled,
    title,
    subtitle
}) {

    const tailwindClasses = `
        ${className} 
        ${isActive ? 'border border-primary border-b-2 border-b-yellow-300' : disabled ? 'border border-[#cccccc]' : 'border border-black'}
        font-${fontWeight}
        text-${fontSize}
        text-${textAlign}
        bg-white
        p-2
        flex
        items-center
        font-semibold
        text-xs
        rounded-md
        transition-colors
        duration-300
        focus:outline-none
        ${disabled ? 'text-[#cccccc]' : 'hover:bg-primary hover:text-white text-black'}
    `;

    return (
        <button
            className={tailwindClasses} 
            onClick={onClick}
            disabled={disabled}
            title={subtitle}
        >
            {startIcon && <span className="mr-2">{startIcon}</span>}
            {title} 
            {endIcon && <span className="ml-2">{endIcon}</span>} 
        </button>
    );
}
