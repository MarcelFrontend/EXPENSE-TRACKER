import React from 'react'
import { GoCopy, GoPaste } from 'react-icons/go'
import { copyData, pasteData } from "@/utils/utils";
import { useData } from '@/context/DataProvider';

const CopyPaste = () => {
    const { data } = useData();

    const hoverActiveAnim = "hover:scale-105 active:scale-95 transition-all duration-300"
    const btnStyles = `flex items-center justify-center px-2 rounded-full border-2 border-blue-500 dark:border-purple-800 dark:hover:border-purple-700 dark:shadow-[inset_0px_0px_5px_2px_rgb(50,10,70)] hover:bg-gray-100 dark:bg-black text-gray-700 hover:text-black dark:text-gray-400 dark:hover:text-gray-100 ${hoverActiveAnim}`

    const iconStyles = "p-2"

    return (
        <div className="flex flex-col gap-4 text-lg">
            <button className={`${btnStyles}`}>
                <GoCopy onClick={() => { if (data) copyData(data) }} className={`${iconStyles} text-[2.75rem]`} title="Skopiuj dane" />
                <span className=''>Kopiuj dane</span>
            </button>
            <button className={`${btnStyles}`}>
                <GoPaste onClick={() => pasteData()} className={`${iconStyles} text-[2.75rem]`} title="Wklej dane" />
                <span className=''>Wklej dane</span>
            </button>
        </div>
    )
}

export default CopyPaste