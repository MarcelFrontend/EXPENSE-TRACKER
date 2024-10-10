"use client"
import Head from "next/head";
import { ExpenseTrackerData, MonthlyExpenses } from "./types";
import { GoTrash, GoMoon, GoSun } from 'react-icons/go'
import { SetStateAction, useEffect, useState } from "react";
import Calendar from "@/components/Calendar";
import { useTheme } from "next-themes";

const initialData: ExpenseTrackerData = {
  2024: {
    0: {
      1: [
        { cena: 6.59, produkt: "Co może mieć taką długą kurwa nazwę" },
        { cena: 3.50, produkt: "Mleko" },
        { cena: 211.99, produkt: "Masło" },
      ],
      2: [
        { cena: 20.99, produkt: "Mleko" },
        { cena: 25.99, produkt: "Jogurt" },
        { cena: 23.99, produkt: "Sok" },
      ],
      3: [
        { cena: 9.99, produkt: "Ser" },
        { cena: 1.99, produkt: "Bułki" },
      ],
      4: [
        { cena: 0, produkt: "" },
        { cena: 0, produkt: "" },
      ],
      5: [
        { cena: 0, produkt: "" },
      ],
      6: [
        { cena: 9.79, produkt: "Jajka" },
        { cena: 1.50, produkt: "Kawa" },
      ],
      7: [
        { cena: 5.00, produkt: "Cukier" },
      ],
      8: [
        { cena: 7.00, produkt: "Czekolada" },
      ]
    },
    1: {
      1: [
        { cena: 8.59, produkt: "Jajka" },
        { cena: 3.00, produkt: "Mleko" },
      ],
      2: [
        { cena: 11.29, produkt: "Woda" },
        { cena: 2.99, produkt: "Sok" },
      ],
      3: [
        { cena: 0, produkt: "" },
        { cena: 2.99, produkt: "Chipsy" },
      ],
      4: [
        { cena: 11.29, produkt: "Woda" },
        { cena: 2.49, produkt: "Batony" },
      ],
    },
    2: {
      1: [
        { cena: 100, produkt: "Nwm" },
      ],
      2: [
        { cena: 1.52, produkt: "Mleko" },
        { cena: 2.00, produkt: "Chleb" },
      ],
      3: [
        { cena: 1.89, produkt: "Jabłko" },
        { cena: 0.99, produkt: "Banany" },
      ],
      4: [
        { cena: 3.45, produkt: "Płatki" },
      ],
    },
    3: {
      1: [
        { cena: 0, produkt: "" },
      ],
      2: [
        { cena: 1.52, produkt: "Mleko" },
      ],
      3: [
        { cena: 1.89, produkt: "Jabłko" },
      ],
      4: [
        { cena: 0.79, produkt: "Ciastka" },
      ],
      7: [
        { cena: 3.50, produkt: "Czipsy" },
      ],
    },
    4: {
      1: [
        { cena: 6.59, produkt: "Co może mieć taką długą kurwa nazwę" },
        { cena: 3.50, produkt: "Mleko" },
        { cena: 2.99, produkt: "Masło" },
      ],
      2: [
        { cena: 10.89, produkt: "Mleko" },
        { cena: 4.20, produkt: "Jogurt" },
        { cena: 5.99, produkt: "Sok" },
      ],
      3: [
        { cena: 9.99, produkt: "Ser" },
        { cena: 1.99, produkt: "Bułki" },
      ],
      4: [
        { cena: 0, produkt: "" },
        { cena: 0, produkt: "" },
      ],
      5: [
        { cena: 0, produkt: "" },
      ],
      6: [
        { cena: 9.79, produkt: "Jajka" },
        { cena: 1.50, produkt: "Kawa" },
      ],
      7: [
        { cena: 5.00, produkt: "Cukier" },
      ],
      8: [
        { cena: 7.00, produkt: "Czekolada" },
      ]
    },
    5: {
      1: [
        { cena: 8.59, produkt: "Jajka" },
        { cena: 3.00, produkt: "Mleko" },
      ],
      2: [
        { cena: 11.29, produkt: "Woda" },
        { cena: 2.99, produkt: "Sok" },
      ],
      3: [
        { cena: 0, produkt: "" },
        { cena: 2.99, produkt: "Chipsy" },
      ],
      4: [
        { cena: 11.29, produkt: "Woda" },
        { cena: 2.49, produkt: "Batony" },
      ],
    },
    6: {
      1: [
        { cena: 100, produkt: "Nwm" },
      ],
      2: [
        { cena: 1.52, produkt: "Mleko" },
        { cena: 2.00, produkt: "Chleb" },
      ],
      3: [
        { cena: 1.89, produkt: "Jabłko" },
        { cena: 0.99, produkt: "Banany" },
      ],
      4: [
        { cena: 3.45, produkt: "Płatki" },
      ],
    },
    7: {
      1: [
        { cena: 0, produkt: "" },
      ],
      2: [
        { cena: 1.52, produkt: "Mleko" },
      ],
      3: [
        { cena: 1.89, produkt: "Jabłko" },
      ],
      4: [
        { cena: 0.79, produkt: "Ciastka" },
      ],
      7: [
        { cena: 3.50, produkt: "Czipsy" },
      ],
    },
    8: {
      1: [
        { cena: 6.59, produkt: "Co może mieć taką długą kurwa nazwę" },
        { cena: 3.50, produkt: "Mleko" },
        { cena: 2.99, produkt: "Masło" },
      ],
      2: [
        { cena: 10.89, produkt: "Mleko" },
        { cena: 4.20, produkt: "Jogurt" },
        { cena: 5.99, produkt: "Sok" },
      ],
      3: [
        { cena: 9.99, produkt: "Ser" },
        { cena: 1.99, produkt: "Bułki" },
      ],
      4: [
        { cena: 0, produkt: "" },
        { cena: 0, produkt: "" },
      ],
      5: [
        { cena: 0, produkt: "" },
      ],
      6: [
        { cena: 9.79, produkt: "Jajka" },
        { cena: 1.50, produkt: "Kawa" },
      ],
      7: [
        { cena: 5.00, produkt: "Cukier" },
      ],
      8: [
        { cena: 7.00, produkt: "Czekolada" },
      ]
    },
    9: {
      1: [
        { cena: 8.59, produkt: "Jajka" },
        { cena: 3.00, produkt: "Mleko" },
      ],
      2: [
        { cena: 11.29, produkt: "Woda" },
        { cena: 2.99, produkt: "Sok" },
      ],
      3: [
        { cena: 0, produkt: "" },
        { cena: 2.99, produkt: "Chipsy" },
      ],
      4: [
        { cena: 11.29, produkt: "Woda" },
        { cena: 2.49, produkt: "Batony" },
      ],
    },
    10: {
      1: [
        { cena: 100, produkt: "Nwm" },
      ],
      2: [
        { cena: 1.52, produkt: "Mleko" },
        { cena: 2.00, produkt: "Chleb" },
      ],
      3: [
        { cena: 1.89, produkt: "Jabłko" },
        { cena: 0.99, produkt: "Banany" },
      ],
      4: [
        { cena: 3.45, produkt: "Płatki" },
      ],
    },
    11: {
      1: [
        { cena: 0, produkt: "" },
      ],
      2: [
        { cena: 1.52, produkt: "Mleko" },
      ],
      3: [
        { cena: 1.89, produkt: "Jabłko" },
      ],
      4: [
        { cena: 0.79, produkt: "Ciastka" },
      ],
      7: [
        { cena: 3.50, produkt: "Czipsy" },
      ],
    },
  },
  2025: {
    0: {
      1: [
        { cena: 6.59, produkt: "Chleb" },
        { cena: 4.50, produkt: "Masło" },
      ],
      2: [
        { cena: 10.82, produkt: "Mleko" },
        { cena: 1.99, produkt: "Serek" },
      ],
      3: [
        { cena: 9.99, produkt: "Ser" },
        { cena: 5.00, produkt: "Sok" },
      ],
    },
    1: {
      1: [
        { cena: 8.59, produkt: "Jajka" },
        { cena: 3.50, produkt: "Kawa" },
      ],
      2: [
        { cena: 11.29, produkt: "Woda" },
        { cena: 2.99, produkt: "Czekolada" },
      ],
    },
    2: {}
  }
};
export default function Index() {
  const [data, setData] = useState<ExpenseTrackerData | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [yearData, setYearData] = useState<MonthlyExpenses | null>(null);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    console.clear();
    const storedData = localStorage.getItem("ExpenseTracker");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  function chooseYear(year: string) {
    setSelectedYear(year);
    if (data) {
      setYearData(data[Number(year)]);
    }
  }

  function reload() {
    localStorage.setItem("ExpenseTracker", JSON.stringify(initialData));
    window.location.reload()
  }

  return (
    <div className="relative w-screen h-screen flex items-center justify-center">
      <Head>
        <title>Expense Tracker</title>
      </Head>
      {yearData ? (
        <Calendar setYearData={setYearData} year={Number(selectedYear)} yearData={yearData} />
      ) : (
        <ul className="flex gap-3">
          {data && Object.entries(data).map(([year]) => (
            <li className="bg-gradient-to-tr from-blue-500 to-blue-600 dark:from-purple-400 dark:to-purple-600 rounded-2xl px-3 shadow-md cursor-pointer hover:scale-105 active:scale-95 duration-100" key={year}
              onClick={() => chooseYear(year)}>
              {year}
            </li>
          ))}
        </ul>
      )}
      <GoTrash onClick={reload} className="absolute left-0.5 text-red-500 bottom-0.5 w-8 h-8 p-0.5 stdInt" />
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute bottom-0.5 right-0.5 transition-colors duration-100"
      >
        {currentTheme === "dark" ? (
          <GoSun className="h-7 md:h-9 lg:h-12 w-auto text-blue-300" />
        ) : (
          <GoMoon className="h-7 md:h-9 lg:h-12 w-auto text-blue-600" />
        )}
      </button>
    </div>
  );
}