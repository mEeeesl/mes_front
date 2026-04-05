import React from 'react';

// Props 타입 정의
interface InputProps {
    name: string;
    type?: 'text' | 'password' | 'email' | 'number';
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string; // 라벨이 필요할 경우를 대비
}

const CustomInput = ({ name, type = 'text', placeholder, value, onChange, label }: InputProps) => {
    return (
        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
        {label && <label htmlFor={name} style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{label}</label>}
        <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px'
            }}
        />
        </div>
    );
};

export default CustomInput;