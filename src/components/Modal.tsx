import React, { ReactNode } from 'react';

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
    return (
        <div data-modal className='absolute inset-0 flex items-center justify-center bg-gray-950/50 pointer-events-none'>
            <div className='pointer-events-auto flex items-center flex-col p-2 bg-gray-700 rounded-lg'>
                <button onClick={onClose} className="self-end">Zamknij</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
