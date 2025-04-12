"use client"
import Modal from '@/components/Modal';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useData } from '@/context/DataProvider'
import { Expense, DailyExpenses, MonthlyExpenses, ExpenseTrackerData } from '@/types/types'
import { monthNames } from '@/utils/utils'
import ReturnLink from '@/components/ReturnLink'
import ThemeToggle from '@/components/ThemeToogle';

const ChosenYear = () => {
    const { data, fetchData } = useData() as { data: ExpenseTrackerData | null; fetchData: () => void };
    const router = useRouter();
    const { year, month, day } = router.query;

    const [chosenDayExpenses, setChosenDayExpenses] = useState<Expense[] | null>(null)
    const [manageChosenExpense, setManageChosenExpense] = useState<Expense>({ product: "", price: 0, source: "" })

    const [addingExpense, setAddingExpense] = useState<boolean>(false)
    const [addingNewSource, setAddingNewSource] = useState<boolean>(false)
    const [editedExpenseIndex, setEditedExpenseIndex] = useState<number | null>(null)

    const [productSuggestions, setProductSuggestions] = useState<string[]>([])
    const [priceSuggestions, setPriceSuggestions] = useState<number[]>([])
    const [allSources, setAllSources] = useState<string[]>([])

    const [chosenDaySources, setChosenDaySources] = useState<string[]>([])

    // Pobieranie danych
    useEffect(() => {
        if (!data) {
            fetchData();
        }

        if (data && day) {
            const expenses = data[Number(year)][monthNames.indexOf(String(month))][Number(day)];
            setChosenDayExpenses(expenses);
        }
    }, [data, fetchData, year, month, day]);

    useEffect(() => {
        prepareData()
    }, [chosenDayExpenses]);

    function prepareData() {
        if (chosenDayExpenses && data) {
            const expenseSources = new Set<string>()
            const productSuggestions = new Set<string>()
            const priceSuggestions = new Set<number>()
            const allSourcesSuggestions = new Set<string>()

            Object.entries(chosenDayExpenses).map(([_, expense]) => {
                if (expense.source) {
                    expenseSources.add(expense.source.trim())
                }
            })

            Object.entries(data).map(([_, yearData]) => {
                Object.entries(yearData).map(([_, monthData]) => {
                    if (Object.keys(monthData as MonthlyExpenses).length > 0) {
                        Object.entries(monthData as MonthlyExpenses).map(([_, dayData]) => {
                            Object.entries(dayData as DailyExpenses).map(([_, expense]) => {
                                productSuggestions.add(expense.product.trim())
                                priceSuggestions.add(expense.price)
                                allSourcesSuggestions.add(expense.source.trim())
                            });
                        });
                    }
                });
            });

            setChosenDaySources(Array.from(expenseSources))
            setProductSuggestions(Array.from(productSuggestions))
            setPriceSuggestions(Array.from(priceSuggestions))
            setAllSources(Array.from(allSourcesSuggestions))
        }
    }

    function saveExpenseState(field: keyof Expense, value: string | number) {
        if (field == "price" && typeof value == 'number' && isNaN(value)) {
            value = ""
        }
        setManageChosenExpense((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    function resetView() {
        setEditedExpenseIndex(null)
        setAddingExpense(false)
        setAddingNewSource(false)
        setManageChosenExpense({ product: "", price: 0, source: "" })
    }

    function editExpense(i: number, expense: Expense) {
        setEditedExpenseIndex(i)
        setAddingExpense(true)
        setManageChosenExpense(expense)
    }

    function deleteExpense(chosenExpense: Expense) {
        if (data && chosenDayExpenses) {
            setChosenDayExpenses(chosenDayExpenses.filter((expense) => expense != chosenExpense))
            data[Number(year)][monthNames.indexOf(String(month))][Number(day)] = chosenDayExpenses.filter((expense) => expense != chosenExpense)
            localStorage.setItem("ExpenseTracker", JSON.stringify(data))
        }
    }

    function modifyExpenseInputs() {
        const machingPriceSuggestions = new Set<number>([])

        if (productSuggestions.includes(manageChosenExpense.product)) {
            Object.entries(data as ExpenseTrackerData).map(([_, yearData]) => {
                Object.entries(yearData).map(([_, monthData]) => {
                    if (Object.keys(monthData as MonthlyExpenses).length > 0) {
                        Object.entries(monthData as MonthlyExpenses).map(([_, dayData]) => {
                            Object.entries(dayData as DailyExpenses).map(([_, expense]) => {
                                if (expense.product == manageChosenExpense.product) {
                                    machingPriceSuggestions.add(expense.price)
                                }
                            });
                        });
                    }
                });
            });
        }

        return (
            <>
                <li className='relative'>
                    <label htmlFor="product">Nazwa</label>
                    <input
                        value={manageChosenExpense.product}
                        type="text"
                        id='product'
                        onChange={(e) => saveExpenseState('product', e.target.value)}
                        list='productSuggestions'
                    />
                    {manageChosenExpense.product.trim().length > 4 && !productSuggestions.includes(manageChosenExpense.product) && (
                        <datalist id='productSuggestions'>
                            {productSuggestions.map((suggestion, index) => {
                                console.log(suggestion);
                                return <option key={index} value={suggestion} />
                            })}
                        </datalist>
                    )}
                </li>
                <li>
                    <label htmlFor="price">Cena</label>
                    <input
                        onChange={(e) => {
                            const val = parseFloat(e.target.value)
                            saveExpenseState('price', isNaN(val) ? 0 : val)
                        }}
                        value={manageChosenExpense.price || ""}
                        type="text"
                        id='price'
                        list='priceSuggestions'
                        pattern="\d+([.,]\d{1,2})?"
                    />
                    {(machingPriceSuggestions.size > 0 || priceSuggestions.length > 0) && (
                        <datalist id='priceSuggestions'>
                            {(machingPriceSuggestions.size > 0
                                ? Array.from(machingPriceSuggestions)
                                : priceSuggestions
                            ).map((suggestion, index) => (
                                <option key={index} value={suggestion} />
                            ))}
                        </datalist>
                    )}
                </li >
            </>
        )
    }

    function editingView(index: number) {
        return (
            <Modal onClose={resetView}>
                <span>Wprowadź dane nowego wydatku</span>
                <ul className='flex flex-col gap-2'>
                    {modifyExpenseInputs()}
                </ul>
                <div className='flex items-center gap-2'>
                    <button onClick={() => saveChange(index)}>
                        {editedExpenseIndex == null ? "Dodaj" : "Zapisz"}
                    </button>
                    <button onClick={() => resetView()}>
                        Anuluj
                    </button>
                </div>
            </Modal>
        );
    }

    function saveChange(index: number, expenseSources: string[] = chosenDaySources) {
        if (chosenDayExpenses && data) {
            if (manageChosenExpense.product.length > 3 && manageChosenExpense.price > 0) {
                // Nowy wydatek
                if (editedExpenseIndex == null) {
                    manageChosenExpense.source = expenseSources[index]
                    data[Number(year)][monthNames.indexOf(String(month))][Number(day)] = [...chosenDayExpenses, manageChosenExpense]

                    setChosenDayExpenses([...chosenDayExpenses, manageChosenExpense])
                } else {
                    chosenDayExpenses[editedExpenseIndex] = manageChosenExpense
                    data[Number(year)][monthNames.indexOf(String(month))][Number(day)] = chosenDayExpenses

                    setChosenDayExpenses(chosenDayExpenses)
                }

                localStorage.setItem("ExpenseTracker", JSON.stringify(data))
                resetView()
            } else {
                alert("Nie możesz dodać pustego wydatku")
            }
        }
    }

    function newSourceView() {

        function handleAddNewSource() {
            if (manageChosenExpense.source.length > 3 && manageChosenExpense.product.length > 3 && manageChosenExpense.price > 0) {
                const expenseSources = new Set([...chosenDaySources])
                expenseSources.add(manageChosenExpense.source)
                setChosenDaySources(Array.from(expenseSources))

                let updatedSources = Array.from(expenseSources)

                saveChange(updatedSources.indexOf(manageChosenExpense.source), updatedSources)
            } else {
                alert("Uzupełnij wszystkie dane")
            }
        }

        return (
            <Modal onClose={resetView}>
                <span>Wprowadź dane</span>
                <ul className='flex flex-col gap-2'>
                    <li>
                        <label htmlFor="source">Nowe źródło</label>
                        <input
                            onChange={(e) => saveExpenseState('source', e.target.value)}
                            value={manageChosenExpense.source}
                            type="text"
                            id='source'
                            list='allSources'
                        />
                        <datalist id='allSources'>
                            {allSources.map((suggestion, index) => {
                                return <option key={index} value={suggestion.trim()}>{suggestion.trim()}</option>
                            })}
                        </datalist>
                        {!allSources.includes(manageChosenExpense.product) && (
                            <datalist id='allSources'>
                                {allSources.map((suggestion, index) => {
                                    return <option key={index} value={suggestion}>{suggestion}</option>
                                })}
                            </datalist>
                        )}
                    </li>
                    {modifyExpenseInputs()}
                </ul>
                <div className='flex items-center gap-2'>
                    <button onClick={() => handleAddNewSource()}>
                        Dodaj
                    </button>
                    <button onClick={() => resetView()}>
                        Anuluj
                    </button>
                </div>
            </Modal>
        )
    }

    return (
        <div className={`relative h-dvh flex items-center justify-center ${addingExpense && "pointer-events-none"}`}>
            <ReturnLink disabled={addingExpense || addingNewSource} linkTo={`/${year}/${month}`} />
            <div className='flex flex-col gap-6'>
                {chosenDaySources.map((source, index) => {
                    return (
                        <ul key={index}>
                            {chosenDayExpenses && Object.entries(chosenDayExpenses).map(([i, expense]) => {
                                if (expense.source == source) {
                                    return (
                                        <li key={i} className='flex gap-2'>
                                            <span>{expense.product}</span>
                                            <span>{expense.price} zł</span>
                                            <span>{expense.source}</span>
                                            <button disabled={addingExpense || addingNewSource} onClick={() => editExpense(Number(i), expense)}>
                                                Edytuj
                                            </button>
                                            <button disabled={addingExpense || addingNewSource} onDoubleClick={() => deleteExpense(expense)}>
                                                Usuń
                                            </button>
                                        </li>
                                    )
                                }
                            })}
                            {addingExpense && editingView(index)}
                            <button disabled={addingExpense || addingNewSource} onClick={() => setAddingExpense(true)}>
                                Dodaj wydatek
                            </button>
                        </ul>
                    )
                })}
                {addingNewSource && newSourceView()}
                <button disabled={addingExpense || addingNewSource} onClick={() => setAddingNewSource(true)}>Dodaj źródło wydatku</button>
            </div>
            <ThemeToggle />
        </div>

    )
}
export default ChosenYear;