import React, { useState } from 'react'
import ThemeToggle from "./ThemeToogle";
import { deleteData } from "@/utils/utils";
import CopyPaste from './CopyPaste'
import { FaCog } from "react-icons/fa";
import { GoTrash } from 'react-icons/go'

const Settings = () => {
    const [showSettings, setShowSettings] = useState<boolean>(false)

    const hoverActiveAnim = "hover:scale-105 active:scale-95 transition-all"

    return (
        <div className='absolute top-5 right-5 flex flex-col items-center gap-3 z-20'>
            <button onClick={() => setShowSettings(!showSettings)} className='self-end text-4xl hover:rotate-180 duration-500'>
                <FaCog />
            </button>
            {showSettings && (
                <div className='flex items-center flex-col gap-3 bg-white dark:bg-gray-950 border-2 border-white shadow-[inset_0px_0px_5px_1px_rgb(225,225,225)] dark:shadow-[inset_0px_0px_5px_1px_rgb(50,50,50)] dark:border-gray-800 rounded-lg px-3 py-2'>
                    <CopyPaste />
                    <button onDoubleClick={() => deleteData()} className={`${hoverActiveAnim} md:w-full flex items-center justify-center md:gap-2 p-2.5 md:px-2 border-2 border-red-800 hover:border-red-600 rounded-full dark:shadow-[0px_0px_10px_2px_rgb(125,0,0)] dark:hover:shadow-[0px_0px_10px_2px_rgb(200,0,0)] hover:bg-gray-100 dark:bg-black text-gray-800 hover:text-black dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300`}>
                        <GoTrash className="text-3xl" title="Usuń dane" />
                        <span className='hidden md:block text-lg'>Usuń dane</span>
                    </button>
                    <ThemeToggle />
                </div>
            )}
        </div>
    )
}

export default Settings