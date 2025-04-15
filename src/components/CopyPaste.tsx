import React, { useEffect } from 'react'
import { GoCopy, GoPaste } from 'react-icons/go'
import { copyData, hoverActiveAnim, pasteData } from "@/utils/utils";
import { useData } from '@/context/DataProvider';

const CopyPaste = () => {
    const { data, fetchData } = useData();

    const btnStyles = `text-5xl rounded-full border-2 border-blue-500 dark:border-purple-800 dark:hover:border-purple-700 dark:shadow-[inset_0px_0px_5px_2px_rgb(50,10,70)] hover:bg-gray-100 dark:bg-black text-gray-700 hover:text-black dark:text-gray-400 dark:hover:text-gray-100 ${hoverActiveAnim} transition-colors`
    const iconStyles = "p-2"

    useEffect(() => {
        if (!data) {
            fetchData();
        }
    }, [data, fetchData]);

    return (
        <div className="absolute bottom-1 left-2 flex gap-4">
            <button className={`${btnStyles}`}>
                <GoCopy onClick={() => { if (data) copyData(data) }} className={`${iconStyles}`} title="Skopiuj dane" />
            </button>
            <button className={`${btnStyles}`}>
                <GoPaste onClick={() => pasteData()} className={`${iconStyles}`} title="Wklej dane" />
            </button>
        </div>
    )
}

export default CopyPaste