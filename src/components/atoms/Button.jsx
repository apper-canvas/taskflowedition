import React from 'react';

const Button = ({ 
    onClick, 
    children, 
    className, 
    type = 'button', 
    // Filter out framer-motion props to prevent React warnings
    whileHover,
    whileTap,
    initial,
    animate,
    exit,
    transition,
    variants,
    ...props 
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={className}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;