"use client"
import Modal from '@/components/Modal';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useData } from '@/context/DataProvider'
import { Expense, DailyExpenses, MonthlyExpenses, ExpenseTrackerData } from '@/types/types'
import { hoverActiveAnim, monthNames } from '@/utils/utils'
import ReturnLink from '@/components/ReturnLink'
import ThemeToggle from '@/components/ThemeToogle';
import { FaEdit, FaTrash } from "react-icons/fa";

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

    const ulStyles = "flex flex-col gap-2"
    const modifyExpenseLiStyles = "relative"
    const labelStyles = "absolute -top-5 left-1 text-sm text-black dark:text-gray-300"
    const inputStyles = "text-black dark:text-gray-400 dark:bg-[rgb(10,10,10)] border border-black dark:border-purple-900 rounded-lg p-1"
    const actBtnStyles = `px-5 py-0.5 border-2 rounded-md dark:text-gray-300 ${hoverActiveAnim} `
    const negActBtnStyles = `${actBtnStyles} bg-white dark:bg-black border-black dark:border-gray-400`
    const posActBtnStyles = `${actBtnStyles} bg-white dark:bg-black border-blue-500 dark:border-purple-700`

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
            const productSuggestionsSet = new Set<string>()
            const priceSuggestionsSet = new Set<number>()
            const allSourcesSuggestions = new Set<string>()

            chosenDayExpenses.forEach((expense) => {
                if (expense.source) {
                    expenseSources.add(expense.source.trim())
                }
            })

            Object.values(data).forEach((yearData) => {
                Object.values(yearData).forEach((monthData) => {
                    if (Object.keys(monthData as MonthlyExpenses).length > 0) {
                        Object.values(monthData as MonthlyExpenses).forEach((dayData) => {
                            Object.values(dayData as DailyExpenses).forEach((expense) => {
                                productSuggestionsSet.add(expense.product.trim())
                                priceSuggestionsSet.add(expense.price)
                                allSourcesSuggestions.add(expense.source.trim())
                            })
                        })
                    }
                })
            })

            setChosenDaySources(Array.from(expenseSources))
            setProductSuggestions(Array.from(productSuggestionsSet))
            setPriceSuggestions(Array.from(priceSuggestionsSet))
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
            const filtered = chosenDayExpenses.filter((expense) => expense != chosenExpense)
            setChosenDayExpenses(filtered)
            data[Number(year)][monthNames.indexOf(String(month))][Number(day)] = filtered
            localStorage.setItem("ExpenseTracker", JSON.stringify(data))
        }
    }

    function modifyExpenseInputs() {
        const machingPriceSuggestions = new Set<number>([])

        if (productSuggestions.includes(manageChosenExpense.product)) {
            Object.values(data as ExpenseTrackerData).forEach((yearData) => {
                Object.values(yearData).forEach((monthData) => {
                    if (Object.keys(monthData as MonthlyExpenses).length > 0) {
                        Object.values(monthData as MonthlyExpenses).forEach((dayData) => {
                            Object.values(dayData as DailyExpenses).forEach((expense) => {
                                if (expense.product == manageChosenExpense.product) {
                                    machingPriceSuggestions.add(expense.price)
                                }
                            })
                        })
                    }
                })
            })
        }

        return (
            <>
                <li className={`${modifyExpenseLiStyles}`}>
                    <label className={`${labelStyles}`} htmlFor="product">Nazwa</label>
                    <input
                        onChange={(e) => saveExpenseState('product', e.target.value)}
                        value={manageChosenExpense.product}
                        type="text"
                        id='product'
                        list='productSuggestions'
                        autoFocus={!addingNewSource}
                        className={`${inputStyles}`}
                    />
                    {manageChosenExpense.product.trim().length > 4 && !productSuggestions.includes(manageChosenExpense.product) && (
                        <datalist id='productSuggestions'>
                            {productSuggestions.map((suggestion, index) => (
                                <option key={index} value={suggestion} />
                            ))}
                        </datalist>
                    )}
                </li>
                <li className={`${modifyExpenseLiStyles}`}>
                    <label className={`${labelStyles}`} htmlFor="price">Cena</label>
                    <input
                        onChange={(e) => {
                            const val = e.target.value
                            if (/^[0-9]*[.,]?[0-9]*$/.test(val) || val === "") {
                                saveExpenseState('price', val)
                            }
                        }}
                        value={manageChosenExpense.price}
                        type="text"
                        id="price"
                        list="priceSuggestions"
                        className={inputStyles}
                    />
                    {manageChosenExpense.product.length > 4 && (machingPriceSuggestions.size > 0 || priceSuggestions.length > 0) && (
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

    function saveChange(index: number, expenseSources: string[] = chosenDaySources) {
        if (chosenDayExpenses && data) {
            const parsedPrice = parseFloat(String(manageChosenExpense.price).replace(',', '.'))
            console.log(parsedPrice);

            if (manageChosenExpense.product.length > 3 && !isNaN(parsedPrice)) {
                const updatedExpense: Expense = {
                    ...manageChosenExpense,
                    price: parsedPrice
                }

                if (editedExpenseIndex == null) {
                    updatedExpense.source = expenseSources[index]
                    const newExpenses = [...chosenDayExpenses, updatedExpense]
                    data[Number(year)][monthNames.indexOf(String(month))][Number(day)] = newExpenses
                    setChosenDayExpenses(newExpenses)
                } else {
                    chosenDayExpenses[editedExpenseIndex] = updatedExpense
                    data[Number(year)][monthNames.indexOf(String(month))][Number(day)] = chosenDayExpenses
                    setChosenDayExpenses([...chosenDayExpenses])
                }

                localStorage.setItem("ExpenseTracker", JSON.stringify(data))
                resetView()
            } else {
                alert("Wypełnij poprawnie wszystkie pola")
            }
        }
    }

    function editingView(index: number) {
        return (
            <Modal onClose={resetView}>
                <span>Wprowadź dane</span>
                <ul className='flex flex-col gap-9'>
                    {modifyExpenseInputs()}
                </ul>
                <div className='flex items-center gap-2'>
                    <button className={`${posActBtnStyles} text-black dark:text-gray-100 bg-blue-500 dark:bg-purple-700`} onClick={() => saveChange(index)}>
                        {editedExpenseIndex == null ? "Dodaj" : "Zapisz"}
                    </button>
                    <button className={`${negActBtnStyles}`} onClick={() => resetView()}>
                        Anuluj
                    </button>
                </div>
            </Modal>
        );
    }

    function newSourceView() {

        function handleAddNewSource() {
            const parsedPrice = parseFloat(String(manageChosenExpense.price).replace(',', '.'))
            console.log(parsedPrice);

            if (manageChosenExpense.source.length > 3 && manageChosenExpense.product.length > 3 && !isNaN(parsedPrice)) {
                const expenseSources = new Set([...chosenDaySources])
                expenseSources.add(manageChosenExpense.source)
                const updatedSources = Array.from(expenseSources)

                setChosenDaySources(updatedSources)
                saveChange(updatedSources.indexOf(manageChosenExpense.source), updatedSources)
            } else {
                alert("Uzupełnij wszystkie dane")
            }
        }

        return (
            <Modal onClose={resetView}>
                <span>Wprowadź dane</span>
                <ul className={`${ulStyles} gap-7`}>
                    <li className={`${modifyExpenseLiStyles}`}>
                        <label className={`${labelStyles}`} htmlFor="source">Nowe źródło</label>
                        <input
                            onChange={(e) => saveExpenseState('source', e.target.value)}
                            value={manageChosenExpense.source}
                            type="text"
                            id='source'
                            list='allSources'
                            className={`${inputStyles}`}
                            autoFocus
                        />
                        <datalist id='allSources'>
                            {allSources.map((suggestion, index) => (
                                <option key={index} value={suggestion.trim()}>{suggestion.trim()}</option>
                            ))}
                        </datalist>
                    </li>
                    {modifyExpenseInputs()}
                </ul>
                <div className='flex items-center gap-5'>
                    <button className={`${posActBtnStyles} text-black dark:text-gray-100 bg-blue-500 dark:bg-purple-700`} onClick={handleAddNewSource}>Dodaj</button>
                    <button className={`${negActBtnStyles}`} onClick={resetView}>Anuluj</button>
                </div>
            </Modal>
        )
    }

    return (
        <div className={`relative h-dvh flex items-center justify-center md:text-lg text-gray-900 dark:text-gray-400 ${addingExpense && "pointer-events-none"}`}>
            <ReturnLink disabled={addingExpense || addingNewSource} linkTo={`/${year}/${month}`} />
            <div className='max-h-[90vh] flex items-center flex-col gap-6 overflow-y-auto customScroll p-10'>
                {chosenDaySources.map((source, index) => (
                    <div key={index} className='flex items-center flex-col pl-4 pr-1 py-3 bg-white dark:bg-[rgb(0,0,0)] border-2 border-blue-400 dark:border-purple-900 rounded-xl shadow-[0px_2px_5px_1px_rgb(200,200,200)] dark:shadow-[inset_0px_0px_10px_5px_rgb(20,0,40)]'>
                        <span className='mb-2 font-bold'>{source}</span>
                        <ul className='max-h-96 flex flex-col gap-4 overflow-y-auto customScroll px-1 pr-3 md:px-3 md:pr-5 pb-1'>
                            {chosenDayExpenses && chosenDayExpenses.map((expense, i) => {
                                if (expense.source === source) {
                                    return (
                                        <li key={i} className={`relative flex justify-between gap-2 dark:bg-[rgb(0,0,0)] py-1 px-2 md:p-2 max-md:text-sm rounded-lg border-2 border-blue-300 dark:border-purple-950 shadow-md dark:shadow-purple-950/75 ${hoverActiveAnim}`}>
                                            <span>{expense.product}</span>
                                            <span>{expense.price} zł</span>
                                            <div className='flex items-center gap-2 text-2xl'>
                                                <button className='text-blue-400 dark:text-blue-600 hover:text-blue-600 dark:hover:text-blue-500' disabled={addingExpense || addingNewSource} onClick={() => editExpense(i, expense)}>
                                                    <FaEdit />
                                                </button>
                                                <button className='text-red-500 dark:text-red-700 hover:text-red-600 dark:hover:text-red-500' disabled={addingExpense || addingNewSource} onDoubleClick={() => deleteExpense(expense)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </li>
                                    )
                                }
                            })}
                        </ul>
                        {addingExpense && editingView(index)}
                        <button className={`mt-8 ${posActBtnStyles} py-1.5`}
                            disabled={addingExpense || addingNewSource} onClick={() => setAddingExpense(true)}>
                            Dodaj wydatek
                        </button>
                    </div>
                ))}
                {addingNewSource && newSourceView()}
                <button className={`${posActBtnStyles} py-2`} disabled={addingExpense || addingNewSource} onClick={() => setAddingNewSource(true)}>
                    Dodaj źródło wydatku
                </button>
            </div>
            <ThemeToggle />
        </div>
    )
}

export default ChosenYear;
