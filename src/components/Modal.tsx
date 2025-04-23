import React, { ReactNode } from 'react';
import { IoIosClose } from 'react-icons/io';

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
    tempModalStyles?: string;
    containerStyles?: string
}

const Modal = ({ children, onClose, tempModalStyles, containerStyles }: ModalProps) => {

    const hoverActiveAnim = "hover:scale-105 active:scale-95 transition-all"

    return (
        <div data-modal className={`absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-gray-950/70 backdrop-blur-[2px] pointer-events-none z-50 ${tempModalStyles}`}>
            <div className='bg-blue-50 dark:bg-black rounded-lg'>
                <div className={`relative pointer-events-auto flex items-center text-center flex-col gap-5 pt-6 p-2 dark:bg-purple-950/25 border-2 border-gray-700 dark:border-purple-900 rounded-lg ${containerStyles}`}>
                    <button className={`absolute -top-2 -right-2 text-5xl text-red-500 ${hoverActiveAnim}`} onClick={onClose}>
                        <IoIosClose />
                    </button>
                    {children}
                </div>
            </div>
        </div>

    );
};

export default Modal;