import Head from "next/head";
import { GoTrash, GoPlus } from 'react-icons/go'
import { useEffect } from "react";
import Link from "next/link";
import CopyPaste from '../components/CopyPaste'
import { useData } from "@/context/DataProvider";
import { deleteData } from "@/utils/utils";
import ThemeToggle from "@/components/ThemeToogle";

export default function Index() {
  const { data, fetchData } = useData();

  useEffect(() => {
    if (!data) {
      fetchData();
      console.log("Po pobraniu danych:", data);
    } else {
      console.log("Dane istniały");
    }
    console.clear();
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
  }

  return (
    <div className="relative w-screen h-[92vh] sm:h-screen flex items-center justify-center text-white dark:text-gray-200">
      <Head>
        <title>Expense Tracker</title>
      </Head>
      <div className="flex items-center flex-col gap-4">
        <ul className="grid grid-cols-3 gap-3">
          {data && Object.entries(data).map(([year]) => (
            <Link href={`/${year}`} className="bg-gradient-to-tr from-blue-500 to-blue-700 dark:from-blue-500 dark:to-blue-800 rounded-3xl px-3 md:px-4 shadow-md stdInt duration-1000 text-3xl md:text-4xl" key={year}>
              {year}
            </Link>
          ))}
        </ul>
        <button onClick={addNewYear} className="bg-gradient-to-tr from-blue-500 to-blue-700 shadow-md dark:from-blue-500 dark:to-blue-800 rounded-full stdInt transition-colors duration-1000">
          <GoPlus className="size-12 md:size-14" />
        </button>
      </div>
      <CopyPaste />
      <button onDoubleClick={() => deleteData()} className="absolute bottom-0">
        <GoTrash className="size-11 md:size-14 text-red-500 dark:text-red-600 border-2 border-black rounded-full p-1.5" title="Usuń dane" />
      </button>
      <ThemeToggle />
    </div>
  )
}