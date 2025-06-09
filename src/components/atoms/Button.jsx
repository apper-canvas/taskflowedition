import React from 'react';

const Button = ({ onClick, children, className, type = 'button', ...props }) => {
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