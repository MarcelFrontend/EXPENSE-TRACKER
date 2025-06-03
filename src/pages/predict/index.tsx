import Modal from '@/components/Modal'
import ReturnLink from '@/components/ReturnLink'
import { useData } from '@/context/DataProvider';
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import React, { useEffect, useState } from 'react'
import { MonthlyExpenses, DailyExpenses } from '@/types/types';
import { FaEdit, FaTrash } from "react-icons/fa";

type AggregatedExpense = {
  product: string,
  price: number[],
  source: string,
  amount: number,
  chosenPriceIndex: number
}

const PredictPrice = () => {
  const hoverActiveAnim = "hover:scale-105 active:scale-95 transition-all"

  const { data, fetchData } = useData();

  const [aggregatedExpenseData, setAggregatedExpenseData] = useState<AggregatedExpense[]>([])
  const [availableProductsName, setAvailableProductsName] = useState<string[]>([])

  const [isAddProductModalShown, setIsAddProductModalShown] = useState<boolean>(false)
  const [isEditProductShown, setIsEditProductShown] = useState<boolean>(false)
  const [newProduct, setNewProduct] = useState<{ product: string, amount: number, price: number }>({ product: "", amount: 1, price: 0 })
  const [savedProducts, setSavedProducts] = useState<AggregatedExpense[]>([])
  const [editedProductName, setEditedProductName] = useState<string>("")

  useEffect(() => {
    if (!data) {
      fetchData();
      console.log("Po pobraniu danych:", data);
    } else {
      console.log("Dane istniały");
    }

    if (data) {
      console.clear();
      const productSuggestionsMap = new Map<string, AggregatedExpense>()

      Object.values(data).forEach((yearData) => {
        Object.values(yearData).forEach((monthData) => {
          if (Object.keys(monthData as MonthlyExpenses).length > 0) {
            Object.values(monthData as MonthlyExpenses).forEach((dayData) => {
              Object.values(dayData as DailyExpenses).forEach((expense) => {
                const key = `${expense.product}-${expense.source}`;

                if (RegExp(/x\d/).test(expense.product.toLowerCase())) return

                if (!productSuggestionsMap.has(key)) {
                  if (expense.price != 0)
                    productSuggestionsMap.set(key, {
                      product: expense.product.toLowerCase(),
                      price: [expense.price],
                      source: expense.source,
                      amount: 1,
                      chosenPriceIndex: 0
                    });

                } else {
                  const existingProduct = productSuggestionsMap.get(key)!;
                  if (!existingProduct.price.includes(expense.price) && expense.price != 0) {
                    existingProduct.price.push(expense.price);
                  }
                }
              })
            })
          }
        })
      })

      const aggregatedProductsArray = new Set<AggregatedExpense>()
      const productsNameSuggestions = new Set<string>([])

      Array.from(productSuggestionsMap).forEach(aggregatedExpense => {
        aggregatedProductsArray.add(aggregatedExpense[1])
        productsNameSuggestions.add(`${aggregatedExpense[1].product.charAt(0).toUpperCase() + aggregatedExpense[1].product.slice(1)} - ${aggregatedExpense[1].source}`)

        // console.log(aggregatedExpense[1].product.charAt(0).toUpperCase() + aggregatedExpense[1].product.slice(1));
      })

      // console.log(Array.from(productsNameSuggestions));
      // console.log(Array.from(aggregatedProductsArray));

      setAggregatedExpenseData(Array.from(aggregatedProductsArray))
      setAvailableProductsName(Array.from(productsNameSuggestions))

    }
  }, [data, fetchData]);

  function AddProductModalView() {
    function handleAddNewProduct() {
      aggregatedExpenseData.map(product => {
        const splitedProductData = newProduct.product.split(" - ")

        if (product.product == splitedProductData[0].toLowerCase() && product.source == splitedProductData[1]) {
          product.amount = newProduct.amount
          product.chosenPriceIndex = product.price[0]
          setSavedProducts(prevState => ([
            ...prevState,
            product
          ]))
        }
      })

      availableProductsName.map(product => {
        if (newProduct.product == product) {
          const updatedAvailableProducts = availableProductsName.filter(availableProduct => availableProduct !== product)

          // console.log(updatedAvailableProducts);

          setAvailableProductsName(updatedAvailableProducts)
        }
      })

      setIsAddProductModalShown(false)
      setNewProduct({ product: "", amount: 1, price: 0 })
    }

    return (
      <Modal containerStyles="bg-blue-100 overflow-hidden" onClose={() => setIsAddProductModalShown(false)}>
        <span>Wprowadź dane produktu</span>
        <ul className='flex flex-col gap-4'>
          <li className='flex items-start flex-col'>
            <label>
              Nazwa
            </label>
            <input onChange={(e) => setNewProduct((prevState) => ({
              ...prevState,
              product: e.target.value
            }))} autoFocus={true} className='px-2 py-1 border border-black rounded-sm' list='productSuggestions' type="text" />
            {newProduct.product.length > 3 && !Array.from(availableProductsName).includes(newProduct.product) && (
              <datalist id='productSuggestions'>
                {availableProductsName.map(productName => {

                  const isAlreadySaved = savedProducts.some(savedProduct => savedProduct.product == productName.toLowerCase());
                  if (isAlreadySaved) return null;
                  return (
                    <option key={productName} value={productName}>
                      {productName}
                    </option>
                  )
                }
                )}
              </datalist>
            )}
          </li>
          <li className='flex items-center'>
            <label className=''>
              Ilość
            </label>
            <div className='w-full flex items-center justify-end'>
              <div className='min-w-[5.5rem] flex items-center justify-between gap-3 '>
                <button disabled={newProduct.amount <= 1} className={`size-8 lg:size-11 relative -left-px flex items-center justify-center rounded-md bg-blue-500 text-white font-bold text-sm lg:text-lg valid:hover:bg-blue-400 valid:active:bg-blue-600 transition-colors duration-100 disabled:cursor-not-allowed disabled:opacity-60`} onClick={() => newProduct.amount > 1 && setNewProduct((prevState) => ({
                  ...prevState,
                  amount: prevState.amount - 1
                }))}>
                  <FaMinus />
                </button>
                <span className='lg:py-1 lg:text-3xl'>
                  {newProduct.amount}
                </span>
                <button className={'size-8 lg:size-11 relative -right-px flex items-center justify-center rounded-md bg-blue-500 text-white font-bold text-sm lg:text-lg hover:bg-blue-400 active:bg-blue-600 transition-colors duration-100'} onClick={() => setNewProduct((prevState) => ({
                  ...prevState,
                  amount: prevState.amount + 1
                }))}>
                  <FaPlus />
                </button>
              </div>
            </div>
          </li>
        </ul>
        <button disabled={!availableProductsName.includes(newProduct.product)} onClick={() => handleAddNewProduct()} className={`bg-blue-500 text-white px-7 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${availableProductsName.includes(newProduct.product) ? hoverActiveAnim : ""}`}>
          Dodaj
        </button>
      </Modal>
    )
  }

  function EditProductModalView() {
    function handleSaveProductChanges() {
      setSavedProducts(prevState => {
        const productToUpdate = prevState.find(expense => expense.product == editedProductName);
        const newProductData = aggregatedExpenseData.find(expense => expense.product == newProduct.product.toLowerCase());

        if (productToUpdate && newProductData) {
          return prevState.map(expense => {
            if (expense.product == editedProductName) {
              return {
                source: newProductData.source,
                price: newProductData.price,
                product: newProductData.product,
                amount: newProduct.amount,
                chosenPriceIndex: newProductData.price[0]
              };
            }
            return expense;
          });
        }
        return prevState;
      });

      setIsEditProductShown(false);
      setNewProduct({ product: "", amount: 1, price: 0 });
    }

    return (
      <Modal onClose={() => setIsEditProductShown(false)}>
        <span>Wprowadź dane produktu</span>
        <ul className='flex flex-col gap-4'>
          <li className='flex items-start flex-col'>
            <label>
              Nazwa
            </label>
            <input onChange={(e) => setNewProduct((prevState) => ({
              ...prevState,
              product: e.target.value
            }))} value={newProduct.product.charAt(0).toUpperCase() + newProduct.product.slice(1)} autoFocus={true} className='px-2 py-1 border border-black rounded-sm' list='productSuggestions' type="text" />
            {newProduct.product.length > 3 && !Array.from(availableProductsName).includes(newProduct.product) && (
              <datalist id='productSuggestions'>
                {Array.from(availableProductsName).map(product => {
                  return <option key={product} value={product}>{product}</option>
                })}
              </datalist>
            )}
          </li>
          <li className='flex items-center'>
            <label className=''>
              Ilość
            </label>
            <div className='w-full flex items-center justify-end'>
              <div className='min-w-[5.5rem] flex items-center justify-between gap-3 '>
                <button disabled={newProduct.amount <= 1} className={`size-8 lg:size-11 relative -left-px flex items-center justify-center rounded-md bg-blue-500 text-white font-bold text-sm lg:text-lg valid:hover:bg-blue-400 valid:active:bg-blue-600 transition-colors duration-100 disabled:cursor-not-allowed disabled:opacity-60`} onClick={() => newProduct.amount > 1 && setNewProduct((prevState) => ({
                  ...prevState,
                  amount: prevState.amount - 1
                }))}>
                  <FaMinus />
                </button>
                <span className='lg:py-1 lg:text-3xl'>
                  {newProduct.amount}
                </span>
                <button className={'size-8 lg:size-11 relative -right-px flex items-center justify-center rounded-md bg-blue-500 text-white font-bold text-sm lg:text-lg hover:bg-blue-400 active:bg-blue-600 transition-colors duration-100'} onClick={() => setNewProduct((prevState) => ({
                  ...prevState,
                  amount: prevState.amount + 1
                }))}>
                  <FaPlus />
                </button>
              </div>
            </div>
          </li>
        </ul>
        <button disabled={!availableProductsName.includes(newProduct.product)} onClick={() => handleSaveProductChanges()} className={`bg-blue-500 text-white px-7 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${availableProductsName.includes(newProduct.product) ? hoverActiveAnim : ""}`}>
          Zapisz
        </button>
      </Modal>
    )
  }

  let totalCost = 0

  function ProductsListView() {
    function handleDeleteProduct(productToRemove: AggregatedExpense) {
      setSavedProducts(prevState => {
        return prevState.filter(savedProduct => savedProduct.product != productToRemove.product)
      })

      const formattedProductToDelete = `${productToRemove.product.charAt(0).toUpperCase()}${productToRemove.product.slice(1)} - ${productToRemove.source}`

      setAvailableProductsName(prevState => [
        ...prevState,
        formattedProductToDelete
      ])

    }

    return (
      <ul className='w-full h-full flex items-start justify-start flex-col gap-3 py-2 overflow-y-auto customScroll pr-2 pl-1'>
        {savedProducts.length > 0 && savedProducts.map(product => {
          function handlePriceChange(productName: string, price: number) {
            setSavedProducts(prevState =>
              prevState.map(product =>
                product.product == productName
                  ? { ...product, chosenPriceIndex: price }
                  : product
              )
            );
          }

          totalCost += product.chosenPriceIndex * product.amount
          return (
            <li className='w-full flex items-center justify-between gap-1 odd:bg-blue-200 even:bg-blue-100 py-2 px-2 rounded-md shadow-md' key={product.product + product.source}>
              <span>
                {product.product.charAt(0).toUpperCase() + product.product.slice(1)}
                 - {product.source}
              </span>
              <div className='flex items-center gap-2'>
                {Array.from(product.price).length > 1 ? (
                  <select onChange={(e) => handlePriceChange(product.product, Number(e.target.value))} className='bg-blue-300 rounded py-1 cursor-pointer hover:bg-blue-400'>
                    {Array.from(product.price).map(productPrice => (
                      <option key={productPrice} value={productPrice}>
                        {productPrice}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{product.price}</span>
                )}
                <span>
                  {(product.chosenPriceIndex * product.amount).toFixed(2)}
                </span>
                <div>
                  <span>{product.amount}x</span>
                </div>
              </div>
              <button onClick={() => { setIsEditProductShown(true); setNewProduct({ product: product.product, price: product.chosenPriceIndex, amount: product.amount }); setEditedProductName(product.product) }} className={`text-2xl text-blue-500 dark:text-blue-600 hover:text-blue-700 dark:hover:text-blue-500`}>
                <FaEdit />
              </button>
              <button onClick={() => handleDeleteProduct(product)} className={`text-2xl text-red-500 dark:text-red-700 hover:text-red-600 dark:hover:text-red-500`}>
                <FaTrash />
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className='h-dvh relative flex items-center justify-center text-black lg:text-2xl'>
      <ReturnLink disabled={isAddProductModalShown || isEditProductShown} />
      <div className='h-96 w-[22rem] flex flex-col bg-white border-2 border-black px-2 pb-3 rounded-md'>
        <span className='font-bold py-0.5'>Lista produktów</span>
        {ProductsListView()}
        <div className='relative w-full flex items-center justify-center pt-2'>
          <button disabled={isAddProductModalShown || isEditProductShown} onClick={() => setIsAddProductModalShown(true)} className={`bg-blue-500 text-white px-3 py-1.5 rounded ${hoverActiveAnim}`}>
            Dodaj produkt
          </button>
          <span className='absolute right-3'>
            {totalCost.toFixed(2)} zł
          </span>
        </div>
      </div>
      {isAddProductModalShown && AddProductModalView()}
      {isEditProductShown && EditProductModalView()}
    </div >
  )
}

export default PredictPrice

// Todo: Przebudować system - podzielić wyświetlanie produktów z podziałem na sklepy?
// Czy musimy mieć state suggestedProductNames - czy nie możemy wykorzystać do tego już istniejący aggregatedExpenseData?
// Klucz dla każdego produktu musi być unikalny czyli product.product + product.source