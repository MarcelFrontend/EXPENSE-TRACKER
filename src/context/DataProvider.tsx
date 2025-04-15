import { ExpenseTrackerData } from "@/types/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface DataFetchCtxProps {
    data: ExpenseTrackerData | null,
    fetchData: () => void
}

const DataFetchCtx = createContext<DataFetchCtxProps | null>(null)

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<ExpenseTrackerData | null>(null)

    const fetchData = () => {
        const storedData = localStorage.getItem("ExpenseTracker");
        
        if (storedData) {
            setData(JSON.parse(storedData))
        } else {
            const newYear = new Date().getFullYear()
            const createdYearData = {
                [newYear]: {
                    0: {},
                    1: {},
                    2: {},
                    3: {},
                    4: {},
                    5: {},
                    6: {},
                    7: {},
                    8: {},
                    9: {},
                    10: {},
                    11: {}
                }
            };

            console.log("Stworzono dane w kontekście:", JSON.stringify(createdYearData));

            localStorage.setItem("ExpenseTracker", JSON.stringify(createdYearData))
            setData(createdYearData)
        }
    }

    return (
        <DataFetchCtx.Provider value= {{ data, fetchData }
}>
    { children }
    </DataFetchCtx.Provider>
    )
}

export const useData = () => {
    const context = useContext(DataFetchCtx);
    if (!context) {
        throw new Error('useData musi zostać użyte w DataProvider');
    }
    return context;
};
