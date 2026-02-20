import React from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;

  label {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-muted);
    margin-left: 2px;
  }

  .input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  input, select, textarea {
    width: 100%;
    background-color: var(--bg-input);
    border: 1px solid var(--border);
    color: var(--text-main);
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    outline: none;
    transition: var(--transition);

    &::placeholder {
      color: var(--text-muted);
      opacity: 0.6;
    }

    &:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  .icon-left {
      position: absolute;
      left: 12px;
      color: var(--text-muted);
  }
  
  &.has-icon input {
      padding-left: 2.5rem;
  }
`;

const InputField = ({
    label,
    type = 'text',
    error,
    icon: Icon,
    className = '',
    as = 'input',
    children,
    ...props
}) => {
    return (
        <InputWrapper className={`${className} ${Icon ? 'has-icon' : ''}`}>
            {label && <label>{label}</label>}
            <div className="input-container">
                {Icon && <Icon size={18} className="icon-left" />}
                {as === 'select' ? (
                    <select {...props}>
                        {children}
                    </select>
                ) : as === 'textarea' ? (
                    <textarea {...props} rows={4} />
                ) : (
                    <input type={type} {...props} />
                )}
            </div>
            {error && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '2px' }}>{error}</span>}
        </InputWrapper>
    );
};

export default InputField;
