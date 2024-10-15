import { GoArrowLeft } from "react-icons/go";
import { DailyExpenses, MonthlyExpenses } from '@/types/types';
import React, { Dispatch, SetStateAction, useState } from 'react';
import DailyExpense from "./DailyExpense";

interface CalendarProps {
    chosenYear: number;
    yearData: MonthlyExpenses;
    setYearData: Dispatch<SetStateAction<MonthlyExpenses | null>>;
}

// Todo: Gdy dodajemy nowy wydatek to suma wydatków się nie aktualizuje
// Możliwość zobaczenia z jakiego sklepu ile wydaliśmy
// Jeśli któreś pole jest puste - nie możesz się cofnąć
// Widok wykresu?
// Możliwość porównania ceny produktu z poprzednimi cenami
// Podpowiadanie ceny danego produktu jeśli mamy o nim dane
// Kopiowanie i wklejanie danych
// Szybki wybór pójścia do dzisiejszego dnia

export default function Calendar({ chosenYear, yearData, setYearData }: CalendarProps) {
    const [monthData, setMonthData] = useState<DailyExpenses | null>()
    const [chosenMonth, setChosenMonth] = useState<number>(0)
    const monthNames = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
        'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];
    const themeSmooth = "transition-colors duration-700"

    function selectMonth(expenses: DailyExpenses, month: number) {
        setChosenMonth(month)
        setMonthData(expenses)
    }

    function getMonthExpenseSum(expenses: DailyExpenses) {
        let monthTotal = 0;
        Object.entries(expenses).forEach(([i, dailyExpenses]) => {
            console.log(i);
            dailyExpenses.forEach((expense: { cena: number }) => {
                monthTotal += expense.cena;
            });
        });
        return monthTotal;
    }

    return (
        <div className={`w-screen h-[93vh] sm:h-screen text-white${themeSmooth}`}>
            {monthData ? <DailyExpense chosenYear={chosenYear} monthData={monthData} setMonthData={setMonthData} chosenMonth={chosenMonth} /> :
                <>
                    <header className={`h-12 md:h-14 flex items-center justify-between px-3 bg-gradient-to-tr from-blue-700 to-blue-950 dark:from-blue-600 dark:to-blue-800 shadow-md ${themeSmooth} z-10 text-white dark:text-gray-200`}>
                        <button onClick={() => setYearData(null)}>
                            <GoArrowLeft className="size-11 md:size-14" />
                        </button>
                        <span className="font-black text-2xl md:text-4xl">{chosenYear}</span>
                    </header>
                    <div className="w-full h-[90%] sm:h-full flex items-center justify-center">
                        <ul className={`h-full w-fit grid grid-cols-2 sm:grid-cols-3 justify-items-center content-center gap-2 text-white dark:text-gray-200 transition-colors duration-75`}>
                            {monthNames.map((monthName, index) => {
                                const expenses = yearData[index] || {};
                                const monthTotal = getMonthExpenseSum(expenses);
                                return (
                                    <button
                                        onClick={() => selectMonth(expenses, index)}
                                        key={index}
                                        className={`${monthTotal > 100 ? "from-red-600 to-red-900" : monthTotal > 50 ? "from-yellow-400 to-yellow-600" : monthTotal > 19 ? "from-green-500 to-green-700" : "from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-900"} min-w-[7.25rem] md:w-40 flex flex-col items-center p-2 text-lg md:text-2xl bg-gradient-to-tr rounded stdInt shadow-md bg-blue-400 ${themeSmooth}`}>
                                        <span className="font-semibold">{monthName}</span>
                                        <span className="font-black">{monthTotal.toFixed(2)} zł</span>
                                    </button>
                                );
                            })}
                        </ul>
                    </div>
                </>
            }
        </div>
    );
}