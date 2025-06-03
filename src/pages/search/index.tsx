"use client"
import React, { useEffect, useState } from 'react'
import ReturnLink from '@/components/ReturnLink'
import { useData } from "@/context/DataProvider";
import { MonthlyExpenses, DailyExpenses } from '@/types/types';

type AggregatedExpense = {
  product: string,
  price: number[],
  source: string
}

const SearchProduct = () => {
  const { data, fetchData } = useData();

  const [searchInput, setSearchInput] = useState<string>("")
  const [showFoundProducts, setShowFoundProducts] = useState<boolean>(false)

  const [productSuggestions, setProductSuggestions] = useState<AggregatedExpense[]>([])
  const [productsName, setProductsName] = useState<string[]>([])

  const hoverActiveAnim = "hover:scale-105 active:scale-95 transition-all"

  useEffect(() => {
    console.clear();

    if (!data) {
      fetchData();
      console.log("Po pobraniu danych:", data);
    } else {
      console.log("Dane istniały");
    }
  }, [data, fetchData]);

  useEffect(() => {
    if (searchInput.length > 3 && data) {
      const productSuggestionsMap = new Map<string, AggregatedExpense>();
      const productsName = new Set<string>()

      Object.values(data).forEach((yearData) => {
        Object.values(yearData).forEach((monthData) => {
          if (Object.keys(monthData as MonthlyExpenses).length > 0) {
            Object.values(monthData as MonthlyExpenses).forEach((dayData) => {
              Object.values(dayData as DailyExpenses).forEach((expense) => {
                if (expense.product.toLowerCase().includes(searchInput.toLowerCase())) {
                  const key = `${expense.product}-${expense.source}`;
                  if (!productSuggestionsMap.has(key)) {
                    productSuggestionsMap.set(key, {
                      product: expense.product.toLowerCase(),
                      price: [expense.price],
                      source: expense.source
                    });
                    productsName.add(expense.product.toLowerCase())
                  } else {
                    const existing = productSuggestionsMap.get(key)!;
                    if (!existing.price.includes(expense.price)) {
                      existing.price.push(expense.price);
                    }
                  }
                }
              });
            });
          }
        });
      });
      
      setProductsName(Array.from(productsName))
      setProductSuggestions(Array.from(productSuggestionsMap.values()));

    } else {
      setProductSuggestions([]);
    }

    if (!productsName.includes(searchInput)) {
      setShowFoundProducts(false)
    }

  }, [searchInput, data]);

  function handleShowFoundProducts() {
    const sourceSuggestions = new Set<string>();

    productSuggestions.forEach(product => {
      sourceSuggestions.add(product.source);
    });

    // Todo: Link do kiedy został zapisany dany produkt

    return (
      <ul className={`md:min-h-44 md:max-h-96 flex items-center ${Array.from(sourceSuggestions).length == 1 && "justify-center"} flex-col gap-4 px-5 py-6 bg-white dark:bg-gray-950 rounded-xl border-2 border-white dark:border-purple-500 shadow-md dark:shadow-[0px_0px_10px_2px_rgb(75,0,100)] overflow-y-auto customScroll`}>
        {Array.from(sourceSuggestions).map(source => {
          return (
            <ul key={source} className={`w-full flex flex-col gap-1`}>
              <span className='font-bold text-lg md:text-xl'>{source}</span>
              <ul className='min-w-72 flex flex-col gap-2 px-2 py-1'>
                {
                  productSuggestions.map((product, index) => {
                    if (product.source === source) {
                      // console.log(product.price.length);
                      return (
                        <li key={product.product + index} className={`w-full flex items-center justify-between max-md:flex-col gap-4 px-4 py-2  even:bg-gray-200 even:dark:bg-gray-800 odd:bg-gray-300 odd:dark:bg-gray-700 rounded-md`}>
                          <span className={`${product.price.length > 1 && "self-start"}`}>
                            {product.product.charAt(0).toUpperCase() + product.product.slice(1)}
                          </span>
                          {product.price.length > 1 ?
                            <ul className='max-md:flex md:grid md:grid-cols-3 gap-1.5'>
                              {product.price.map(price => (
                                <li key={price} className='text-center px-1 py-1 text-white dark:text-gray-200 bg-blue-500 dark:bg-purple-950 dark:border-2 dark:border-purple-700 rounded'>
                                  {price} zł
                                </li>
                              ))}
                            </ul>
                            :
                            <span className='text-center px-2 py-1 text-white dark:text-gray-200 bg-blue-500 dark:bg-purple-950 dark:border-2 dark:border-purple-700 rounded'>
                              {product.price} zł
                            </span>
                          }
                        </li>
                      );
                    }
                    return null;
                  })
                }
              </ul>
            </ul>
          )
        })}
        {/* <ul className={`w-full flex flex-col gap-1`}>
          <span className='font-bold text-lg md:text-xl'>Biedronka</span>
          <ul className='min-w-72 flex flex-col gap-2 px-2 py-1'>
            <li className={`w-full flex items-center justify-between max-md:flex-col gap-4 px-4 py-2  even:bg-gray-200 even:dark:bg-gray-800 odd:bg-gray-300 odd:dark:bg-gray-700 rounded-md`}>
              <span className={`self-start`}>
                Mieszanka bakaliowa
              </span>
              <ul className='max-md:flex md:grid md:grid-cols-3 gap-1.5'>
                <li className='text-center px-1 py-1 text-white dark:text-gray-200 bg-blue-500 dark:bg-purple-950 dark:border-2 dark:border-purple-700 rounded'>
                  8.12 zł
                </li>
                <li className='text-center px-1 py-1 text-white dark:text-gray-200 bg-blue-500 dark:bg-purple-950 dark:border-2 dark:border-purple-700 rounded'>
                  8.12 zł
                </li>
                <li className='text-center px-1 py-1 text-white dark:text-gray-200 bg-blue-500 dark:bg-purple-950 dark:border-2 dark:border-purple-700 rounded'>
                  8.12 zł
                </li>
              </ul>
            </li>
          </ul>
        </ul> */}
      </ul>
    );
  }

  return (
    <div className='h-dvh flex items-center justify-center text-gray-800 dark:text-gray-300'>
      <ReturnLink />
      <div className='h-full flex items-center flex-col gap-20 pt-20 px-3'>
        <div className='flex items-center justify-center gap-5'>
          <input autoFocus={true} value={searchInput} onKeyUp={(e) => e.key == "Enter" && setShowFoundProducts(true)} onChange={(e) => setSearchInput(e.target.value)} type="text" placeholder='Wpisz nazwę produktu' list='productSuggestions' className='px-2 py-2 rounded-lg dark:bg-gray-800 shadow-md' />
          {productSuggestions && !productsName.includes(searchInput) && (
            <datalist id='productSuggestions'>
              {productSuggestions.map((suggestion, index) => (
                <option key={index} value={suggestion.product.charAt(0).toUpperCase() + suggestion.product.slice(1)} />
              ))}
            </datalist>
          )}
          <button disabled={productSuggestions.length == 0} onClick={() => setShowFoundProducts(true)} className={`disabled:opacity-50 disabled:text-black text-white disabled:dark:text-gray-300 disabled:cursor-not-allowed px-5 py-1.5 rounded bg-blue-400 dark:bg-purple-700 ${productSuggestions.length > 0 && hoverActiveAnim}`}>
            Szukaj
          </button>
        </div>
        <div>
          {showFoundProducts && handleShowFoundProducts()}
        </div>
      </div>
    </div>
  )
}

export default SearchProduct