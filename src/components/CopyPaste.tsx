import React, { useEffect } from 'react'
import { GoCopy, GoPaste } from 'react-icons/go'
import { copyData, pasteData } from "@/utils/utils";
import { useData } from '@/context/DataProvider';

const CopyPaste = () => {
    const { data, fetchData } = useData();

    useEffect(() => {
        if (!data) {
            fetchData();
            console.log("Po pobraniu danych:", data);
        } else {
            console.log("Dane istniały");
        }
        console.clear();
    }, []);

    return (
        <div className="absolute bottom-2 left-2 flex gap-4">
            <GoCopy onClick={() => { if (data) copyData(data) }} className="text-5xl p-1 bg-blue-500 rounded-full cursor-pointer" title="Skopiuj dane" />
            <GoPaste onClick={() => pasteData()} className="text-5xl p-1 bg-blue-500 rounded-full cursor-pointer" title="Wklej dane" />
        </div>
    )
}

export default CopyPaste