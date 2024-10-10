import { DailyExpenses, Expense } from "@/pages/types";
import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import DayExpeses from "./DayExpeses";

interface DailyExpenseProps {
    monthData: DailyExpenses
    setMonthData: React.Dispatch<React.SetStateAction<DailyExpenses | null | undefined>>
    chosenMonth: number
    chosenYear: number
}

export default function DailyExpense({ monthData, setMonthData, chosenMonth, chosenYear }: DailyExpenseProps) {
    const [selectedDayData, setSelectedDayData] = useState<Expense[] | null>(null)
    const [selectedDay, setSelectedDay] = useState<number>(0)

    function getDayExpenseSum() {
        return Object.entries(monthData).map(([day, expenses]) => {
            let total = 0;
            expenses.forEach((expense: { cena: number; }) => {
                total += expense.cena;
            });
            return { day, total };
        });
    }
    const dayTotals = getDayExpenseSum();

    function chooseDay(day: string) {
        setSelectedDay(Number(day))

        setSelectedDayData(monthData[Number(day)])
        // console.log(monthData[Number(day)]);

        // monthData[Number(day)].forEach(expense => {
        // console.log(expense);
        // })
    }

    return (<>
        {selectedDayData ? <DayExpeses setSelectedDayData={setSelectedDayData} selectedDayData={selectedDayData} chosenYear={chosenYear} chosenMonth={chosenMonth} chosenDay={selectedDay} /> :
            <div className="h-screen">
                <header className='bg-gray-900 dark:bg-blue-900 h-10 flex items-center justify-between px-3 '>
                    <button onClick={() => setMonthData(null)}>
                        <GoArrowLeft className="w-8 h-8" />
                    </button>
                    <span className="font-black text-xl">{chosenYear}{">"}{chosenMonth + 1}</span>
                </header>
                <div className="w-full h-full flex items-center justify-center">
                    <ul className="md:w-fit grid justify-items-center content-center gap-2 grid-cols-4 md:grid-cols-7">
                        {dayTotals.map(({ day, total }) => (
                            <button onClick={() => chooseDay(day)} className={`${Number(total.toFixed(2)) > 100 ? "text-red-500" : Number(total.toFixed(2)) > 60 ? "text-yellow-400" : "text-blue-500"} ${(Number(day) % 6) == 0 && "bg-yellow-950"} ${(Number(day) % 7) == 0 && "bg-red-950"} min-w-[4.5rem] min-h-[4.5rem] md:w-20 md:h-20 flex items-center justify-center md:px-0 border stdInt`} key={day}>
                                {Number(total.toFixed(2))} zł
                            </button>
                        ))}
                    </ul>
                </div>
            </div>
        }
    </>
    );
}
