import { DailyExpenses, Expense, ExpenseTrackerData, MonthlyExpenses } from "@/pages/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GoArrowLeft, GoPlus, GoTrash } from "react-icons/go";

interface DailyExpenseProps {
    setSelectedDayData: Dispatch<SetStateAction<Expense[] | [] | null>>;
    selectedDayData: Expense[] | null;
    setSelectedDay: Dispatch<SetStateAction<number>>;
    chosenYear: number;
    chosenMonth: number;
    chosenDay: number;
}

export default function DayExpeses({ setSelectedDayData, selectedDayData, setSelectedDay, chosenYear, chosenMonth, chosenDay }: DailyExpenseProps) {
    const [storedData, setStoredData] = useState<ExpenseTrackerData>();
    const [produktSuggestions, setProductSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const storedData = localStorage.getItem("ExpenseTracker");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setStoredData(parsedData);
            const productSuggestions = new Set<string>();
            Object.values(parsedData as ExpenseTrackerData).forEach(year => {
                Object.values(year as MonthlyExpenses).forEach(month => {
                    Object.values(month as DailyExpenses).forEach(day => {
                        if (Array.isArray(day)) {
                            day.forEach((expense: { produkt: string, cena: number }) => {
                                if (expense.produkt != "" && expense.cena != 0) {
                                    productSuggestions.add(expense.produkt);
                                }
                                removeEmptyExpenses();

                            });
                        }
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
            if (selectedDayData) {
                const updatedDayData = [...selectedDayData];
                updatedDayData[index].produkt = value;
                setSelectedDayData(updatedDayData);
            }
        }
    }

    function priceChange(index: number, value: string) {
        if (storedData) {
            const updatedData = { ...storedData };
            updatedData[chosenYear][chosenMonth][chosenDay][index].cena = parseFloat(value);
            setStoredData(updatedData);
            localStorage.setItem("ExpenseTracker", JSON.stringify(updatedData));
            if (selectedDayData) {
                const updatedDayData = [...selectedDayData];
                updatedDayData[index].cena = parseFloat(value);
                setSelectedDayData(updatedDayData);
            }
        }
    }

    function addNewExpense() {
        removeEmptyExpenses()
        if (storedData) {
            const updatedData = { ...storedData };

            if (!updatedData[chosenYear][chosenMonth][chosenDay]) {
                updatedData[chosenYear][chosenMonth][chosenDay] = [];
            }
            const newExpense: Expense = { produkt: "", cena: 0 };
            updatedData[chosenYear][chosenMonth][chosenDay].push(newExpense);
            setStoredData(updatedData);
            localStorage.setItem("ExpenseTracker", JSON.stringify(updatedData));
            setSelectedDayData(updatedData[chosenYear][chosenMonth][chosenDay]);
        }
    }

    function removeEmptyExpenses() {
        if (storedData && selectedDayData) {
            const filteredDayData = selectedDayData.filter(
                (expense) => expense.produkt !== "" && expense.cena !== 0
            );
            const updatedData = { ...storedData };
            updatedData[chosenYear][chosenMonth][chosenDay] = filteredDayData;
            setStoredData(updatedData);
            localStorage.setItem("ExpenseTracker", JSON.stringify(updatedData));
            setSelectedDayData(filteredDayData);
        }
    }

    function removeSelectedExpense(index: number) {
        if (storedData && selectedDayData) {
            const updatedDayData = selectedDayData.filter((_, i) => i !== index);
            const updatedData = { ...storedData };
            updatedData[chosenYear][chosenMonth][chosenDay] = updatedDayData;

            setStoredData(updatedData);
            localStorage.setItem("ExpenseTracker", JSON.stringify(updatedData));
            setSelectedDayData(updatedDayData);
        }
    }

    function getBack() {
        const updatedData = { ...storedData };
        setStoredData(updatedData);
        localStorage.setItem("ExpenseTracker", JSON.stringify(updatedData));

        setSelectedDay(0)
    }

    return (
        <>
            <header className='bg-gray-900 dark:bg-blue-900 h-10 flex items-center justify-between px-3'>
                <button onClick={getBack}>
                    <GoArrowLeft className="w-8 h-8" />
                </button>
                <span className="font-black text-xl">{`${chosenYear}>${chosenMonth + 1}>${chosenDay}`}</span>
            </header>
            <div className="max-w-full h-full flex items-center justify-center flex-col gap-2">
                <div className="max-w-full max-h-80 overflow-y-auto customScroll">
                    <ul className="flex flex-col gap-2 py-1">
                        {selectedDayData?.map((day: Expense, index) => (
                            <li className="w-[19rem] relative overflow-hidden md:group" key={index}>
                                <div className="w-72 md:max-w-full flex items-center justify-between gap-2 border-l-2 border-t-2 border-b-2 dark:border-black px-3 rounded-sm text-lg overflow-x-hidden">
                                    <input
                                        autoFocus={true}
                                        list="produktSuggestions"
                                        className="w-full bg-transparent outline-none py-0.5 placeholder:text-white"
                                        type="text"
                                        value={day.produkt}
                                        onChange={(e) => produktChange(index, e.target.value)}
                                        placeholder="Produkt"
                                    />
                                    <datalist id="produktSuggestions">
                                        {day.produkt.length >= 2 && produktSuggestions.map((item, idx) => (
                                            <option key={idx} value={item} />
                                        ))}
                                    </datalist>
                                    <div className="border-l dark:border-l-slate-300 whitespace-nowrap pr-1">
                                        <input
                                            onChange={(e) => priceChange(index, e.target.value)}
                                            step={0.01}
                                            type="number"
                                            min={0}
                                            value={day.cena || ""}
                                            className={`${day.cena > 1000 ? "font-black text-red-500 w-[5.5rem] md:w-24" : day.cena > 40 ? "text-red-500 w-[4.66rem] md:w-[4.65rem]" : day.cena > 20 ? "text-yellow-500 w-16" : day.cena > 10 ? "w-16 text-green-200" : " w-12 md:w-16 text-green-200"}  w-14 bg-transparent outline-none bg-blue-950  pl-1 mr-1 placeholder:text-white`}
                                            placeholder="00.00"
                                        />
                                        zł
                                    </div>
                                </div>
                                <button onClick={() => removeSelectedExpense(index)} className="absolute right-0.5 top-[5.5px] text-red-600 dark:text-red-400 md:hidden md:group-hover:block">
                                    <GoTrash className="size-7 stdInt " />
                                </button>
                            </li>

                        ))}
                    </ul>
                </div>
                <button onClick={() => addNewExpense()}>
                    <GoPlus className="size-11 bg-blue-500 text-white rounded-full  shadow-md" />
                </button>
            </div>
        </>
    );
}
