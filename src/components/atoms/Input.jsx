import React from 'react';

const Input = ({ className, type = 'text', value, onChange, placeholder, autoFocus, min, onKeyDown, ...props }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${className}`}
            autoFocus={autoFocus}
            min={min}
            onKeyDown={onKeyDown}
            {...props}
        />
    );
};

export default Input;