import { GoPlus } from 'react-icons/go'
import { FaSearch, FaShoppingBag } from "react-icons/fa";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useData } from "@/context/DataProvider";
import { monthNames } from "@/utils/utils";

export default function Index() {
  const { data, fetchData } = useData();
  const [currentYearDataExists, setCurrentYearDataExists] = useState<boolean>(false)
  const date = new Date()

  const todayDateLink = `${date.getFullYear()}/${monthNames[date.getMonth()]}/${date.getDate()}`

  const hoverActiveAnim = "hover:scale-105 active:scale-95 transition-all"
  const btnStyles = "rounded-full bg-white dark:bg-black border-2 border-blue-500 dark:border-purple-900 dark:hover:border-purple-700 shadow-[0px_0px_6px_1px_rgb(190,190,250)] dark:shadow-[inset_0px_0px_5px_2px_rgb(50,10,70)] dark:hover:shadow-[inset_0px_0px_5px_2px_rgb(90,50,120)] dark:hover:text-gray-300"

  useEffect(() => {
    if (!data) {
      fetchData();
      console.log("Po pobraniu danych:", data);
    } else {
      console.log("Dane istniały");
    }
    if (data) {
      Object.entries(data).map(([year]) => {
        if (year == String(date.getFullYear())) {
          setCurrentYearDataExists(true)
        }
      })
    }
  }, [data, fetchData]);

  function addNewYear() {
    const newYear = (Object.keys(data!).length > 0) ? Math.max(...Object.keys(data!).map(Number)) + 1 : new Date().getFullYear();
    const updatedData = {
      ...data,
      [newYear]: {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {},
        7: {},
        8: {},
        9: {},
        10: {},
        11: {}
      }
    };

    localStorage.setItem("ExpenseTracker", JSON.stringify(updatedData));
    fetchData()
  }

  // Dodanie amount do produktu?
  return (
    <div className="relative h-dvh flex items-center justify-between flex-col text-black dark:text-gray-400">
      <main className="h-full relative flex items-center justify-center flex-col gap-7 md:gap-5">
        <div className='flex flex-col items-center gap-7'>
          <ul className="grid grid-cols-3 gap-3">
            {data && Object.entries(data).map(([year]) => (
              <Link href={`/${year}`} className={`py-2 px-8 md:text-2xl ${btnStyles} ${hoverActiveAnim}`} key={year}>
                {year}
              </Link>
            ))}
          </ul>
          <button onClick={addNewYear} className={`hidden md:block ${hoverActiveAnim} ${btnStyles}`}>
            <GoPlus className="size-12 md:size-14" />
          </button>
        </div>
        {currentYearDataExists &&
          <Link href={todayDateLink} className={`text-xl lg:text-2xl text-blue-700 dark:text-purple-500 ${hoverActiveAnim}`}>
            Przejdź do dzisiaj
          </Link>
        }
      </main>
      <footer className='relative h-16 w-full flex gap-10 dark:text-black dark:bg-purple-700 rounded-t'>
        <Link href={"/search"} className={`flex justify-center flex-1 px-3 md:px-6 py-3 md:py-2 text-center rounded-full`}>
          <FaSearch className='text-4xl' />
          <span className='hidden md:block'>
            Znajdź produkt
          </span>
        </Link>
        <button onClick={addNewYear} className={`absolute left-1/2 -translate-x-1/2 bottom-6 md:hidden dark:text-white ${hoverActiveAnim} ${btnStyles}`}>
          <GoPlus className="size-16 md:size-14" />
        </button>
        <Link href={"/predict"} className={`flex justify-center flex-1 px-3 md:px-6 py-3 md:py-2 text-center rounded-full`}>
          <FaShoppingBag className='text-4xl' />
          <span className='hidden md:block'>
            Przewidywanie kosztów
          </span>
        </Link>
      </footer>
    </div>
  )
}