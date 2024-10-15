import Head from "next/head";
import { ExpenseTrackerData, MonthlyExpenses } from "../types/types";
import { GoMoon, GoSun, GoPlus } from 'react-icons/go'
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

  // function reload() {
  //   localStorage.removeItem("ExpenseTracker");
  //   window.location.reload()
  // }

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

  return (
    <div className="relative w-screen h-screen flex items-center justify-center">
      <Head>
        <title>Expense Tracker</title>
      </Head>
      {yearData ? (
        <Calendar setYearData={setYearData} chosenYear={Number(selectedYear)} yearData={yearData} />
      ) : (
        <div className="flex items-center flex-col gap-4">
          <ul className="grid grid-cols-3 gap-3">
            {savedData && Object.entries(savedData).map(([year]) => (
              <button className="bg-gradient-to-tr from-blue-500 to-blue-700 dark:from-blue-500 dark:to-blue-800 rounded-2xl md:rounded-3xl px-3 md:px-4 shadow-md stdInt duration-1000 text-3xl md:text-4xl" key={year}
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
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute bottom-2 right-2 transition-colors duration-100 stdInt"
      >
        {currentTheme === "dark" ? (
          <GoSun className="h-12 md:h-14 w-auto text-blue-300" />
        ) : (
          <GoMoon className="h-12 md:h-14 w-auto text-blue-700" />
        )}
      </button>
    </div>
  );
}