import { DailyExpenses, Expense } from "@/types/types";
import { useEffect, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import DayExpeses from "./DayExpeses";

interface DailyExpenseProps {
    monthData: DailyExpenses
    setMonthData: React.Dispatch<React.SetStateAction<DailyExpenses | null | undefined>>
    chosenMonth: number
    chosenYear: number
}

export default function DailyExpense({ monthData, setMonthData, chosenMonth, chosenYear }: DailyExpenseProps) {
    const [selectedDayData, setSelectedDayData] = useState<Expense[] | null | []>(null)
    const [selectedDay, setSelectedDay] = useState<number>(0)

    const isSunday = "border-red-500 from-blue-700 to-blue-900"
    const isMonday = "border-green-500 from-blue-600 to-blue-900"
    const isSaturday = "border-yellow-500 from-blue-600 to-blue-900"
    const isDefault = "border-blue-200 dark:border-blue-400 from-blue-500 to-blue-800 dark:from-blue-600 dark:to-blue-800"

    useEffect(() => {
        const storedData = localStorage.getItem("ExpenseTracker");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setMonthData(parsedData[chosenYear]?.[chosenMonth]);
        }
    }, [selectedDay]);

    function getDayExpenseSum() {
        const allDaysInMonth = new Date(chosenYear, chosenMonth + 1, 0).getDate();
        const dayTotals = [];

        for (let day = 1; day <= allDaysInMonth; day++) {
            const currentDay = new Date(chosenYear, chosenMonth, day);
            const dayIndex = currentDay.getDay();

            if (monthData[day]) {
                let total = 0;
                monthData[day].forEach((expense: Expense) => {
                    total += expense.cena;
                });
                dayTotals.push({ day, total, dayIndex });
            } else {
                dayTotals.push({ day, total: 0, dayIndex });
            }
        }
        return dayTotals;
    }

    function chooseDay(day: number) {
        setSelectedDay(day)
        setSelectedDayData(monthData[day])
    }

    return (
        <>
            {selectedDay !== 0 ? <DayExpeses setSelectedDayData={setSelectedDayData} selectedDayData={selectedDayData} setSelectedDay={setSelectedDay} chosenYear={chosenYear} chosenMonth={chosenMonth} chosenDay={selectedDay} /> :
                <div className="h-[80vh] sm:h-screen">
                    <header className='h-12 md:h-14 bg-gradient-to-tr from-blue-700 to-blue-950 dark:from-blue-600 dark:to-blue-800 flex items-center justify-between px-3'>
                        <button onClick={() => setMonthData(null)}>
                            <GoArrowLeft className="size-11 md:size-14" />
                        </button>
                        <span className="font-black text-2xl md:text-4xl">{chosenYear}{">"}{chosenMonth + 1}</span>
                    </header>
                    <div className="w-full h-full flex items-center justify-center overflow-y-hidden">
                        <ul className="grid justify-items-center content-center gap-2 grid-cols-4 md:grid-cols-7 text-[1.4rem] md:text-[1.75rem] leading-5 md:leading-7">
                            {getDayExpenseSum().map(({ day, total, dayIndex }) => (
                                <button
                                    onClick={() => chooseDay(day)}
                                    className={`relative min-w-14 min-h-14 md:w-16 md:h-16 text-base sm:text-2xl flex items-center justify-center flex-col border-2 rounded-sm font-black stdInt bg-gradient-to-tr ${dayIndex == 0 ? isSunday : dayIndex == 1 ? isMonday : dayIndex == 6 ? isSaturday : isDefault} ${Number(total.toFixed(2)) > 60 ? "text-red-400" : Number(total.toFixed(2)) > 40 ? "text-yellow-200" : "text-green-400"} `}
                                    key={day}>
                                    {total ? (
                                        <>
                                            <span className="absolute right-0 -top-1 text-blue-400">{day}</span>
                                            <span>{Number(total.toFixed(2))}</span>
                                            <span>zł</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="absolute right-0 -top-1 text-blue-400">{day}</span>
                                            <span>-</span>
                                        </>
                                    )}
                                </button>
                            ))}
                        </ul>
                    </div>
                </div>
            }
        </>
    );
}
