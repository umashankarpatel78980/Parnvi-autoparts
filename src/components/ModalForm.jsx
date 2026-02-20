import React, { useEffect } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: flex;
  justify-content: flex-end;
  opacity: 0;
  animation: fadeIn 0.2s forwards;

  @keyframes fadeIn {
    to { opacity: 1; }
  }
`;

const SlideOver = styled.div`
  width: 100%;
  max-width: 500px;
  height: 100vh;
  background-color: var(--bg-card);
  border-left: 1px solid var(--border);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @keyframes slideIn {
    to { transform: translateX(0); }
  }

  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(255, 255, 255, 0.02);

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-main);
    }

    button {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: var(--text-main);
      }
    }
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
  }
`;

const ModalForm = ({ title, onClose, children }) => {
    useEffect(() => {
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <Backdrop onClick={onClose}>
            <SlideOver onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button onClick={onClose} aria-label="Close">
                        <X size={24} />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </SlideOver>
        </Backdrop>
    );
};

export default ModalForm;
