import React from 'react';
import Input from '@/components/atoms/Input';

const FormField = ({ label, type = 'text', value, onChange, placeholder, error, className, ...props }) => {
    const inputClassName = `${className || ''} ${error ? 'border-error' : 'border-gray-200'}`;

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <Input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClassName}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-error">{error}</p>
            )}
        </div>
    );
};

export default FormField;