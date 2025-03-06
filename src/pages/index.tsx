import Head from "next/head";
import { ExpenseTrackerData, MonthlyExpenses } from "../types/types";
import { GoTrash, GoMoon, GoSun, GoPlus, GoCopy, GoPaste } from 'react-icons/go'
import { useEffect, useState } from "react";
import Calendar from "@/components/Calendar";
import { useTheme } from "next-themes";

export default function Index() {
  const [savedData, setSavedData] = useState<ExpenseTrackerData>({});
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [yearData, setYearData] = useState<MonthlyExpenses | null>(null);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    console.clear();
    const storedData = localStorage.getItem("ExpenseTracker");
    if (storedData) {
      setSavedData(JSON.parse(storedData));
    }
  }, []);

  function chooseYear(year: string) {
    setSelectedYear(year);
    if (savedData) {
      setYearData(savedData[Number(year)]);
    }
  }

  function deleteData() {
    if (confirm("Wyczyścisz wszystkie dane, czy chcesz kontynuować?")) {
      localStorage.removeItem("ExpenseTracker");
      window.location.reload()
    } else {
      alert("Dane zachowano")
    }
  }

  function addNewYear() {
    const newYear = (Object.keys(savedData || {})).length > 0 ? Math.max(...Object.keys(savedData).map(Number)) + 1 : new Date().getFullYear()
    const updatedData = {
      ...savedData,
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

    localStorage.setItem("ExpenseTracker", JSON.stringify(updatedData))
    setSavedData(updatedData)
  }

  function copyData() {
    if (savedData) {
      navigator.clipboard.writeText(JSON.stringify(savedData)).then(() => {
        console.log('Dane skopiowane do schowka!');
      }).catch(err => {
        console.error('Błąd podczas kopiowania danych: ', err);
      });
    }
  }

  function pasteData() {
    navigator.clipboard.readText().then(value => {
        localStorage.setItem("ExpenseTracker", value);
        console.log('Dane zostały dodane do localStorage:', JSON.parse(value));
    }).catch(err => {
        console.error('Błąd podczas wklejania danych: ', err);
    });
}


  return (
    <div className="relative w-screen h-[92vh] sm:h-screen flex items-center justify-center text-white dark:text-gray-200">
      <Head>
        <title>Expense Tracker</title>
      </Head>
      {yearData ? (
        <Calendar setYearData={setYearData} chosenYear={Number(selectedYear)} yearData={yearData} />
      ) : (
        <div className="flex items-center flex-col gap-4">
          <ul className="grid grid-cols-3 gap-3">
            {savedData && Object.entries(savedData).map(([year]) => (
              <button className="bg-gradient-to-tr from-blue-500 to-blue-700 dark:from-blue-500 dark:to-blue-800 rounded-3xl px-3 md:px-4 shadow-md stdInt duration-1000 text-3xl md:text-4xl" key={year}
                onClick={() => chooseYear(year)}>
                {year}
              </button>
            ))}
          </ul>
          <button onClick={addNewYear} className="bg-gradient-to-tr from-blue-500 to-blue-700 shadow-md dark:from-blue-500 dark:to-blue-800 rounded-full stdInt transition-colors duration-1000">
            <GoPlus className="size-12 md:size-14" />
          </button>
        </div>
      )}
      <GoCopy onClick={() => copyData()} className="text-5xl p-1 bg-blue-500 rounded-full" />
      <GoPaste onClick={() => pasteData()} className="text-5xl p-1 bg-blue-500 rounded-full" />
      <button onDoubleClick={() => deleteData()} className="absolute bottom-0">
        <GoTrash className="size-11 md:size-14 text-red-500 dark:text-red-600 border-2 border-black rounded-full p-1.5" />
      </button>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute bottom-0 right-2.5 transition-colors duration-100 stdInt"
      >
        {currentTheme === "dark" ? (
          <GoSun className="h-9 md:h-14 w-auto text-blue-300" />
        ) : (
          <GoMoon className="h-9 md:h-14 w-auto text-blue-700" />
        )}
      </button>
    </div>
  )
}