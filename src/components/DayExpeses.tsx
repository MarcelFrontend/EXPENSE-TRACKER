import { Expense, ExpenseTrackerData } from "@/pages/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GoArrowLeft } from "react-icons/go";

interface DailyExpenseProps {
    setSelectedDayData: Dispatch<SetStateAction<Expense[] | null>>;
    selectedDayData: Expense[] | [];
    chosenYear: number;
    chosenMonth: number;
    chosenDay: number;
}

export default function DayExpeses({ setSelectedDayData, selectedDayData, chosenYear, chosenMonth, chosenDay }: DailyExpenseProps) {
    const [storedData, setStoredData] = useState<ExpenseTrackerData>();
    const [produktSuggestions, setProductSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const storedData = localStorage.getItem("ExpenseTracker");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setStoredData(parsedData);
            const productSuggestions = new Set<string>();
            Object.values(parsedData).forEach(year => {
                Object.values(year).forEach(month => {
                    Object.values(month ).forEach(day => {
                        day.forEach((expense: { produkt: string; }) => {
                            if (expense.produkt) {
                                productSuggestions.add(expense.produkt);
                            }
                        });
                    });
                });
            });
            setProductSuggestions(Array.from(productSuggestions));
        }
        
    }, []);

    function produktChange(index: number, value: string) {
        if (storedData) {
            const updatedData = { ...storedData };
            updatedData[chosenYear][chosenMonth][chosenDay][index].produkt = value;
            setStoredData(updatedData);
            localStorage.setItem("ExpenseTracker", JSON.stringify(updatedData));

            const updatedDayData = [...selectedDayData];
            updatedDayData[index].produkt = value;
            setSelectedDayData(updatedDayData);
        }
    }

    function priceChange(index: number, value: string) {
        if (storedData) {
            const updatedData = { ...storedData };
            updatedData[chosenYear][chosenMonth][chosenDay][index].cena = parseFloat(value);
            setStoredData(updatedData);
            localStorage.setItem("ExpenseTracker", JSON.stringify(updatedData));

            const updatedDayData = [...selectedDayData];
            updatedDayData[index].cena = parseFloat(value);
            setSelectedDayData(updatedDayData);
        }
    }

    function getBack() {
        setSelectedDayData(null);
    }

    return (
        <>
            <header className='bg-gray-900 dark:bg-blue-900 h-10 flex items-center justify-between px-3'>
                <button onClick={getBack}>
                    <GoArrowLeft className="w-8 h-8" />
                </button>
                <span className="font-black text-xl">{`${chosenYear}>${chosenMonth + 1}>${chosenDay}`}</span>
            </header>
            <div className="w-full h-full flex items-center justify-center">
                <ul className="flex flex-col gap-2">
                    {selectedDayData?.map((day: Expense, index) => (
                        <li className="flex items-center justify-between gap-2 border px-3 rounded-sm" key={index}>
                            <input
                                list="produktSuggestions"
                                className="bg-transparent outline-none"
                                type="text"
                                value={day.produkt}
                                onChange={(e) => produktChange(index, e.target.value)}
                            />
                            <datalist id="produktSuggestions">
                                {produktSuggestions.map((item, idx) => (
                                    <option key={idx} value={item} />
                                ))}
                            </datalist>
                            <div>
                                <input
                                    onChange={(e) => priceChange(index, e.target.value)}
                                    step={0.01}
                                    type="number"
                                    min={0}
                                    value={day.cena}
                                    className={`${day.cena > 40 ? "text-red-500 w-[4.5rem]" : day.cena > 20 ? "text-yellow-300 w-14" : "text-green-500 w-12"} bg-transparent outline-none pr-0.5 `}
                                />
                                zł
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
