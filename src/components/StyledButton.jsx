import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.95rem;
  transition: var(--transition);
  cursor: pointer;
  border: 1px solid transparent;

  &.text {
      background: transparent;
      color: var(--text-main);
      &:hover {
          background: rgba(255,255,255,0.05);
      }
  }

  &.primary {
    background-color: var(--primary);
    color: #fff;
    &:hover {
      background-color: var(--primary-hover);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }
  }

  &.secondary {
    background-color: var(--bg-input);
    color: var(--text-main);
    border-color: var(--border);
    &:hover {
      border-color: var(--text-muted);
      background-color: var(--bg-card);
    }
  }

  &.outline {
    background-color: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    &:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
  }
  
  &.danger {
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--danger);
    border: 1px solid rgba(239, 68, 68, 0.2);
    &:hover {
      background-color: var(--danger);
      color: white;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const StyledButton = ({
    children,
    variant = 'primary', // primary, secondary, outline, danger, text
    className = '',
    icon: Icon,
    ...props
}) => {
    return (
        <Button className={`${variant} ${className}`} {...props}>
            {Icon && <Icon size={18} />}
            {children}
        </Button>
    );
};

export default StyledButton;
