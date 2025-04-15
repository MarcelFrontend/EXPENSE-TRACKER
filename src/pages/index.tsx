import { GoTrash, GoPlus } from 'react-icons/go'
import { useEffect } from "react";
import Link from "next/link";
import CopyPaste from '../components/CopyPaste'
import { useData } from "@/context/DataProvider";
import { deleteData, hoverActiveAnim } from "@/utils/utils";
import ThemeToggle from "@/components/ThemeToogle";

export default function Index() {
  const { data, fetchData } = useData();

  const mainStyles = "rounded-full bg-white dark:bg-black border-2 border-blue-500 dark:border-purple-900 dark:hover:border-purple-700 shadow-[0px_0px_6px_1px_rgb(175,175,250)] dark:shadow-[inset_0px_0px_5px_2px_rgb(50,10,70)] dark:hover:shadow-[inset_0px_0px_5px_2px_rgb(90,50,120)] dark:hover:text-gray-300"

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
    <div className="relative h-dvh flex items-center justify-center text-black dark:text-gray-400">
      <div className="flex items-center flex-col gap-7">
        <ul className="grid grid-cols-3 gap-3">
          {data && Object.entries(data).map(([year]) => (
            <Link href={`/${year}`} className={`py-2 px-8 md:text-2xl ${mainStyles} ${hoverActiveAnim}`} key={year}>
              {year}
            </Link>
          ))}
        </ul>
        <button onClick={addNewYear} className={`${hoverActiveAnim} ${mainStyles}`}>
          <GoPlus className="size-12 md:size-14" />
        </button>
      </div>
      <CopyPaste />
      <button onDoubleClick={() => deleteData()} className={`absolute bottom-1 ${hoverActiveAnim}`}>
        <GoTrash className="size-11 md:size-14 p-1.5 border-2 border-red-800 hover:border-red-600 rounded-full dark:shadow-[0px_0px_10px_2px_rgb(125,0,0)] dark:hover:shadow-[0px_0px_10px_2px_rgb(200,0,0)] hover:bg-gray-100 dark:bg-black text-gray-800 hover:text-black dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300" title="Usuń dane" />
      </button>
      <ThemeToggle />
    </div>
  )
}