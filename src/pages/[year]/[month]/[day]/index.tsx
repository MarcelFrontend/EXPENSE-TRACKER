"use client"
import Modal from '@/components/Modal';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useData } from '@/context/DataProvider'
import { Expense, DailyExpenses, MonthlyExpenses, ExpenseTrackerData } from '@/types/types'
import { monthNames } from '@/utils/utils'
import ReturnLink from '@/components/ReturnLink'
import ThemeToggle from '@/components/ThemeToogle';
import { FaEdit, FaTrash } from "react-icons/fa";
import { GoCopy, GoPaste } from 'react-icons/go';

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

    const hoverActiveAnim = "hover:scale-105 active:scale-95 transition-all"
    const ulStyles = "flex flex-col gap-2"
    const modifyExpenseLiStyles = "relative"
    const labelStyles = "absolute -top-5 left-1 text-sm text-black dark:text-gray-300"
    const inputStyles = "text-black dark:text-gray-400 dark:bg-[rgb(10,10,10)] border border-black dark:border-purple-900 rounded-lg p-1"
    const actBtnStyles = `px-5 py-0.5 border-2 rounded-md dark:text-gray-300 ${hoverActiveAnim} `
    const negActBtnStyles = `${actBtnStyles} bg-white dark:bg-black border-black dark:border-gray-400`
    const posActBtnStyles = `${actBtnStyles} bg-white dark:bg-black border-blue-500 dark:border-purple-700`

    useEffect(() => {
        console.clear();
    
        if (!data) {
            fetchData();
        }
    
        if (data && day) {
            const monthExpenses = data[Number(year)][monthNames.indexOf(String(month))];
            let dayExpenses = monthExpenses[Number(day)];
    
            if (!monthExpenses.hasOwnProperty(Number(day))) {
               dayExpenses = []
                data[Number(year)][monthNames.indexOf(String(month))][Number(day)] = dayExpenses
            }

            setChosenDayExpenses(dayExpenses);
        }
    }, [data, fetchData, year, month, day]);

    useEffect(() => {
        // Funkcja odpowiadająca za utworzenie listy proponowanych elementów wydatku np nazwa produktu, cena produktów oraz nazwy źródeł wydatków
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
                                    if (expense.product.trim().length > 3) productSuggestionsSet.add(expense.product.trim())
                                    if (expense.price > 0) priceSuggestionsSet.add(expense.price)
                                    if (!Array.from(expenseSources).includes(expense.source.trim())) allSourcesSuggestions.add(expense.source.trim())
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
        prepareData()
    }, [chosenDayExpenses, data]);

    // Funkcja obsługująca zmiane stanu w konkretnym elemencie np product, price lub source
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

    // Funkcja zmianu stanu edycji na true oraz ustawiająca odpowiedni index oraz wybrany wydatek, który będzie edytowany
    function editExpense(i: number, expense: Expense) {
        setEditedExpenseIndex(i)
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

    // Funkcja wyświetlająca widok edycji/dodania/utworzenia wydatku
    function modifyExpenseInputsView() {
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

    // Funkcja obsługująca edycje istniejącego lub dodanie nowego wydatku 
    function saveChange(index: number, expenseSources: string[] = chosenDaySources) {
        if (chosenDayExpenses && data) {
            const parsedPrice = parseFloat(String(manageChosenExpense.price).replace(',', '.'))
            if (parsedPrice <= 0) {
                alert("Cena musi być większa niż 0.")
                return
            }
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
                alert("Wypełnij poprawnie wszystkie pola.")
            }
        }
    }

    // Modal pokazujący widok edycji danego indeksu
    function editingView(index: number) {
        return (
            <Modal onClose={resetView}>
                <span>Wprowadź dane</span>
                <ul className='flex flex-col gap-9'>
                    {modifyExpenseInputsView()}
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

    // Funkcja obsługująca wyświetlenie i dodanie nowego źródła wydatku
    function newSourceView() {
        function handleAddNewSource() {
            const parsedPrice = parseFloat(String(manageChosenExpense.price).replace(',', '.'))

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
                    {modifyExpenseInputsView()}
                </ul>
                <div className='flex items-center gap-5'>
                    <button className={`${posActBtnStyles} text-black dark:text-gray-100 bg-blue-500 dark:bg-purple-700`} onClick={() => handleAddNewSource()}>Dodaj</button>
                    <button className={`${negActBtnStyles}`} onClick={resetView}>Anuluj</button>
                </div>
            </Modal>
        )
    }

    function copyPasteDayExpense() {

        const actionBtnStyles = `text-4xl md:text-5xl rounded-full border-2 border-blue-500 dark:border-purple-800 dark:hover:border-purple-700 dark:shadow-[inset_0px_0px_5px_2px_rgb(50,10,70)] hover:bg-gray-100 dark:bg-black text-gray-700 hover:text-black dark:text-gray-400 dark:hover:text-gray-100 ${hoverActiveAnim} transition-colors`

        function pasteDayExpense() {
            navigator.clipboard.readText().then(pastedData => {
                setChosenDayExpenses(JSON.parse(pastedData))
                if (data && JSON.parse(pastedData).length > 0) {
                    data[Number(year)][monthNames.indexOf(String(month))][Number(day)] = JSON.parse(pastedData)
                    localStorage.setItem("ExpenseTracker", JSON.stringify(data))
                    alert("Dane zostały zapisane.")
                }
            }).catch(err => {
                console.error('Błąd:', err);
                alert("Błąd podczas zapisywania danych.")
            });
        }

        function copyDayExpense() {
            let prompt = ""
            if (chosenDayExpenses && chosenDayExpenses.length > 0) {
                prompt = "Sugerując się zawartością tych danych dodaj nowe wydatki pochodzące z paragonu w podobny sposób, to znaczy przy dodawaniu nazwy produktu nie kończ słów ani nie dodawaj ilości ani wagi produktu, przy zapisywaniu ceny uwzględnij ewentualne opusty, a przy źródle produktu napisz tylko nazwę sklepu bez pisania ulicy, na której się znajduje. Oto zapisane dane do których masz dopisać nowe wraz z istniejącymi danymi:"
                navigator.clipboard.writeText(prompt + JSON.stringify(chosenDayExpenses)).then(() => {
                    alert('Dane i zapytanie skopiowane do schowka.')
                }).catch(err => {
                    alert('Błąd podczas kopiowania.')
                    console.error('Błąd podczas kopiowania danych: ', err);
                });
            } else {
                prompt = "Z zawartości tego zdjęcia wypisz w formacie json dane wydatków w formacie: {product: <nazwa_produktu>,price:<cena_produktu>,source:<pochodzenie/sklep_w_którym_został_kupiony_produkt>}, w nazwie produktu nie pisz ilości ani wagi zakupionego produktu, przepisz nazwę produktu taką jaka jest na paragonie i nie dokańczaj nazw oraz nie rozwijaj skrótów, jako cene uwzględnij cene po opuście jeśli występuje, jako pochodzenie wydatku napisz tylko nazwę sklepu czyli np: Biedronka, Carrefour lub cokolwiek innego bez pisania dokładnego adresu."
                navigator.clipboard.writeText(prompt).then(() => {
                    alert('Zapytanie skopiowane do schowka.')
                }).catch(err => {
                    alert('Błąd podczas kopiowania.')
                    console.error('Błąd podczas kopiowania danych: ', err);
                });
            }
        }

        return (
            <div className='absolute left-4 bottom-2 flex gap-2'>
                <button onClick={() => copyDayExpense()} title='Przygotuj zapytanie dla AI' className={`${actionBtnStyles}`}>
                    <GoCopy className='p-2' />
                </button>
                <button onClick={() => pasteDayExpense()} title='Wklej zawartość paragonu wygenerowaną przez ChatGPT' className={`${actionBtnStyles}`}>
                    <GoPaste className='p-2' />
                </button>
            </div>
        )
    }

    return (
        <div className={`relative h-dvh flex items-center justify-center md:text-lg text-gray-900 dark:text-gray-400 ${addingExpense && "pointer-events-none"}`}>
            <ReturnLink disabled={addingExpense || addingNewSource} linkTo={`/${year}/${month}`} />
            <div className='max-h-[90vh] flex items-center flex-col gap-6 overflow-y-auto customScroll p-10 overflow-x-hidden'>
                {chosenDaySources.map((source, index) => {
                    let totalExpenses = 0
                    return (
                        <div key={index} className='w-[110%] relative flex items-center flex-col pl-4 pr-1 py-3 bg-white dark:bg-[rgb(0,0,0)] border-2 border-blue-400 dark:border-purple-900 rounded-xl shadow-[0px_2px_5px_1px_rgb(200,200,200)] dark:shadow-[inset_0px_0px_10px_5px_rgb(20,0,40)]'>
                            <span className='mb-2 font-bold'>{source}</span>
                            <ul className='w-full max-h-96 flex flex-col gap-4 overflow-y-auto customScroll px-1 pr-3 md:px-3 md:pr-5 pb-1'>
                                {chosenDayExpenses && chosenDayExpenses.map((expense, i) => {
                                    if (expense.source === source) {
                                        totalExpenses += expense.price
                                        return (
                                            <li key={i} className={`w-full relative flex items-center justify-between gap-2 dark:bg-[rgb(0,0,0)] py-1.5 px-2 max-md:text-sm rounded-lg border-2 border-blue-300 dark:border-purple-950 shadow-md dark:shadow-purple-950/75`}>
                                                <span>{expense.product.length > 13 ? expense.product.slice(0, 12) + "..." : expense.product}</span>
                                                <div className='flex items-center gap-2'>
                                                    <span className='max-md:text-sm whitespace-nowrap'>{expense.price} zł</span>
                                                    <button className={`text-2xl text-blue-400 dark:text-blue-600 hover:text-blue-600 dark:hover:text-blue-500 ${hoverActiveAnim}`} disabled={addingExpense || addingNewSource} onClick={() => editExpense(i, expense)}>
                                                        <FaEdit />
                                                    </button>
                                                    <button className={`text-2xl text-red-500 dark:text-red-700 hover:text-red-600 dark:hover:text-red-500 ${hoverActiveAnim}`} disabled={addingExpense || addingNewSource} onDoubleClick={() => deleteExpense(expense)}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </li>
                                        )
                                    }
                                })}
                            </ul>
                            <div className='w-full flex items-center justify-between mt-3 pr-4'>
                                {addingExpense && editingView(index)}
                                <button className={`${posActBtnStyles} py-1.5`}
                                    disabled={addingExpense || addingNewSource} onClick={() => setAddingExpense(true)}>
                                    Dodaj wydatek
                                </button>
                                <div className='flex items-center flex-col'>
                                    <span>Suma:</span>
                                    <span className={`font-semibold ${Number(totalExpenses.toFixed(2)) < 50 ? "text-green-500 dark:text-green-500" : Number(totalExpenses.toFixed(2)) < 70 ? "text-yellow-500 dark:text-yellow-500" : "text-red-500 dark:text-red-500"}`}>{totalExpenses.toFixed(2)} zł</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {addingNewSource && newSourceView()}
                <button className={`${posActBtnStyles} py-2`} disabled={addingExpense || addingNewSource} onClick={() => setAddingNewSource(true)}>
                    Dodaj źródło wydatku
                </button>
            </div>
            {copyPasteDayExpense()}
            <ThemeToggle />
        </div>
    )
}

export default ChosenYear;
