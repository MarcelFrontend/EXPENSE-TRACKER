import { GoArrowLeft } from "react-icons/go";
import { DailyExpenses, MonthlyExpenses } from '@/pages/types';
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import DailyExpense from "./DailyExpense";

interface CalendarProps {
    year: number;
    yearData: MonthlyExpenses;
    setYearData: Dispatch<SetStateAction<MonthlyExpenses | null>>;
}

export default function Calendar({ year, yearData, setYearData }: CalendarProps) {
    const [totalExpenseSum, setTotalExpenseSum] = useState<number>(0);
    const [monthData, setMonthData] = useState<DailyExpenses | null>()
    const [chosenMonth, setChosenMonth] = useState<number>(0)
    const monthNames = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
        'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];
    const themeSmooth = "transition-colors duration-700"

    useEffect(() => {
        const total = getTotalExpenseSum();
        setTotalExpenseSum(total);
    }, [yearData]);

    function getTotalExpenseSum() {
        let total = 0;
        Object.entries(yearData).forEach(([_, expenses]) => {
            Object.entries(expenses).forEach(([_, dailyExpenses]) => {
                dailyExpenses.forEach((expense: { cena: number }) => {
                    total += expense.cena;
                });
            });
        });
        return total;
    }

    function selectMonth(expenses: DailyExpenses, month: string) {

        setChosenMonth(Number(month))
        setMonthData(expenses)
    }

    function getMonthExpenseSum(expenses: DailyExpenses) {
        let monthTotal = 0;
        Object.entries(expenses).forEach(([_, dailyExpenses]) => {
            dailyExpenses.forEach((expense: { cena: number }) => {
                monthTotal += expense.cena;
            });
        });
        return monthTotal;
    }

    return (
        <div className='w-screen h-screen text-blue-400 border border-black'>
            {monthData ? <DailyExpense chosenYear={year} monthData={monthData} setMonthData={setMonthData} chosenMonth={chosenMonth} /> :
                <>
                    <header className={`bg-gray-900 dark:bg-blue-900 h-10 flex items-center justify-between px-3 ${themeSmooth}`}>
                        <button onClick={() => setYearData(null)}>
                            <GoArrowLeft className="w-7 h-7" />
                        </button>
                        <span className="font-black text-xl">{year}</span>
                    </header>
                    <div className="w-full h-full flex items-center justify-center">
                        <ul className={`h-full w-fit grid grid-cols-3 justify-items-center content-center gap-2 text-white dark:text-black ${themeSmooth}`}>
                            {Object.entries(yearData).map(([month, expenses]) => (
                                <button onClick={() => selectMonth(expenses, month)} key={month} className={`${Number(getMonthExpenseSum(expenses).toFixed(2)) > 100 ? "from-red-600 to-red-900" : Number(getMonthExpenseSum(expenses).toFixed(2)) > 50 ? "from-yellow-400 to-yellow-600" : "from-blue-600 to-blue-800 "} min-w-28 flex flex-col items-center bg-gradient-to-tr p-2 rounded stdInt font-semibold`}>
                                    <span>{monthNames[Number(month)]}</span>
                                    <span>{getMonthExpenseSum(expenses).toFixed(2)} zł</span>
                                </button>
                            ))}
                        </ul>
                    </div>
                </>
            }
        </div>
    );
}