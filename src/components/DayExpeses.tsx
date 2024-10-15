import { DailyExpenses, Expense, ExpenseTrackerData, MonthlyExpenses } from "@/types/types";
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
    const [shopsSuggestions, setShopsSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const storedData = localStorage.getItem("ExpenseTracker");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setStoredData(parsedData);
            const productSuggestions = new Set<string>();
            const shopSuggestions = new Set<string>();
            Object.values(parsedData as ExpenseTrackerData).forEach(year => {
                Object.values(year as MonthlyExpenses).forEach(month => {
                    Object.values(month as DailyExpenses).forEach(day => {
                        if (Array.isArray(day)) {
                            day.forEach((expense: { produkt: string, cena: number, sklep: string }) => {
                                if (expense.produkt != "" && expense.cena != 0 && expense.sklep) {
                                    productSuggestions.add(expense.produkt);
                                    shopSuggestions.add(expense.sklep);

                                }
                                removeEmptyExpenses();
                            });
                        }
                    });
                });
            });
            setProductSuggestions(Array.from(productSuggestions));
            setShopsSuggestions(Array.from(shopSuggestions));

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

    function shopChange(index: number, value: string) {
        if (storedData) {
            const updatedData = { ...storedData };
            updatedData[chosenYear][chosenMonth][chosenDay][index].sklep = value;
            setStoredData(updatedData);
            localStorage.setItem("ExpenseTracker", JSON.stringify(updatedData));

            if (selectedDayData) {
                const updatedDayData = [...selectedDayData];
                updatedDayData[index].sklep = value;
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
            const newExpense: Expense = { produkt: "", cena: 0, sklep: "" };
            updatedData[chosenYear][chosenMonth][chosenDay].push(newExpense);
            setStoredData(updatedData);
            localStorage.setItem("ExpenseTracker", JSON.stringify(updatedData));
            setSelectedDayData(updatedData[chosenYear][chosenMonth][chosenDay]);
        }
    }

    function removeEmptyExpenses() {
        if (storedData && selectedDayData) {
            const filteredDayData = selectedDayData.filter(
                (expense) => expense.produkt !== "" && expense.cena !== 0 && expense.sklep !== ""
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
            <header className='h-12 md:h-14 bg-gradient-to-tr from-blue-700 to-blue-950 dark:from-blue-600 dark:to-blue-800 flex items-center justify-between px-3'>
                <button onClick={getBack}>
                    <GoArrowLeft className="size-11 md:size-14" />
                </button>
                <span className="font-black text-2xl md:text-4xl">{`${chosenYear}>${chosenMonth + 1}>${chosenDay}`}</span>
            </header>
            <div className="h-full flex items-center justify-center flex-col gap-3">
                <div className="max-w-full max-h-[30rem] sm:max-h-80 overflow-y-auto customScroll">
                    <ul className="flex flex-col gap-6 sm:gap-3 py-1">
                        {selectedDayData?.map((day: Expense, index) => (
                            <li className="w-[17rem] md:w-[28rem] flex items-start flex-col gap-1 relative overflow-hidden md:group" key={index}>
                                <div>
                                    <input
                                        onChange={(e) => shopChange(index, e.target.value)}
                                        value={day.sklep}
                                        placeholder="Sklep"
                                        className="w-[8.25rem] md:w-40 outline-none pl-3 py-[1px] placeholder:text-white/75 border bg-blue-900 dark:bg-blue-800 rounded-sm text-xl md:text-2xl"
                                        type="text"
                                        list="shopsSuggestions"
                                    />
                                    <datalist id="shopsSuggestions">
                                        {day.sklep.length >= 2 && shopsSuggestions.map((item, idx) => (
                                            <option key={idx} value={item} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="w-72 md:w-full relative md:max-w-full flex items-center justify-between gap-2 border-l-2 border-t-2 border-b-2 border-white px-3 rounded-sm text-2xl md:text-4xl overflow-x-hidden bg-blue-800 dark:bg-blue-600">
                                    <input
                                        autoFocus={true}
                                        list="produktSuggestions"
                                        className="w-full bg-transparent outline-none py-0.5 placeholder:text-white/75"
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
                                            className={`${day.cena > 1000 ? "font-black text-red-400 w-[5.5rem] md:w-24" : day.cena > 40 ? "text-red-400 font-black w-[5.75rem] md:w-32" : day.cena > 20 ? "text-yellow-400 w-20 md:w-28" : day.cena > 10 ? "w-20 text-green-400 md:w-28" : " w-12 md:w-24 text-green-400"} w-16 bg-transparent outline-none pl-1 mr-1 placeholder:text-white`}
                                            placeholder="0.00"
                                        />
                                        zł
                                    </div>
                                </div>
                                <button onDoubleClick={() => removeSelectedExpense(index)} className="absolute right-3 top-px text-red-600 dark:text-red-500 md:hidden md:group-hover:block">
                                    <GoTrash className="size-8 md:size-10 stdInt " />
                                </button>
                            </li>

                        ))}
                    </ul>
                </div>
                <button onClick={() => addNewExpense()}>
                    <GoPlus className="size-11 md:size-14 bg-gradient-to-tr from-blue-500 to-blue-800 dark:from-blue-500 dark:to-blue-700 text-white rounded-full shadow-md" />
                </button>
            </div>
        </>
    );
}
