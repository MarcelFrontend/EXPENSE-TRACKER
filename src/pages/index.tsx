import { useEffect, useState } from "react";
import Head from "next/head";
import { GoArrowLeft } from "react-icons/go";
import { GoGear } from "react-icons/go";
import { GoPlus } from "react-icons/go";
export default function Index() {
  const months = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Pażdziernik", "Listopad", "Grudzień"
  ];
  const [expenses, setExpenses] = useState<number[]>([]);
  const [dailyExpenses, setDailyExpenses] = useState<number[]>([]);
  const [showMonthExpenses, SetShowMonthExpenses] = useState(false)

  const generateMonthExpense = () => {
    let expense;
    do {
      expense = Math.floor(Math.random() * 1000);
    } while (expense > 150 || expense < 50);
    return expense;
  };
  const generateDayExpense = () => {
    let expense;
    do {
      expense = Math.floor(Math.random() * 1000);
    } while (expense > 60 || expense < 8);
    return expense;
  };
  useEffect(() => {
    const generatedExpenses = months.map(generateMonthExpense);
    const generatedDailyExpenses = Array.from({ length: daysInCurrentMonth }, generateDayExpense);
    setDailyExpenses(generatedDailyExpenses);

    setExpenses(generatedExpenses);
  }, []);

  const showMonthDetails = () => { }
  const addNewExpenseInMonths = () => { }

  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }

  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;
  const daysInCurrentMonth = getDaysInMonth(
    currentYear,
    currentMonth,
  );

  return (
    <div>
      <Head>
        <title>Expense Tracker</title>
      </Head>
      <div className="relative h-screen flex flex-col overflow-y-hidden">
        <header className="w-screen h-10 flex items-center justify-between px-2">
          <GoArrowLeft className="w-8 h-8" />
          <span className="sticky top-1 text-2xl p-2 text-green-500 font-bold">2024</span>
          <GoGear className="w-7 h-7" />
        </header>
        <main className="relative flex-grow flex items-center justify-center flex-col gap-2 overflow-hidden">
          <div className="w-screen">
            {!showMonthExpenses ? (
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-4 px-2 md:px-0">
                {months.map((month, index) => (
                  <li onClick={() => { showMonthDetails(); SetShowMonthExpenses(!showMonthExpenses) }} key={month} className="min-w-36 flex items-center justify-between gap-2 px-2 py-1 text-lg lg:text-3xl
              border-2 border-green-500 rounded-md cursor-pointer hover:scale-105 transition-transform active:scale-95">
                    <span>{month}</span>
                    <span className={`${expenses[index] > 120 ? "text-red-500 font-black"
                      : expenses[index] > 80 ? "text-yellow-400" : "text-green-500"} tracking-wide`}>
                      {expenses[index] + "zł" || "Błąd"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="max-w-[35rem] mx-auto grid grid-cols-7 select-none">
                {dailyExpenses.map((expense, day) => (
                  <li key={day} className={`w-20 h-20 border ${expense > 50 ? "bg-red-400 font-black" : expense > 30 ? "bg-yellow-400/95" : "bg-green-500"} tracking-wide text-black hover:opacity-90 active:opacity-75 transition-opacity cursor-pointer flex items-center justify-center`}>  
                    {expense}zł
                  </li>
                ))}
              </ul>
            )
            }
          </div>
        </main>
        <button onClick={addNewExpenseInMonths} className="w-[calc(100vw-25px)] md:w-[calc(100vw-50px)] flex items-center justify-center mx-3 mb-3 rounded-full bg-green-500 hover:scale-105 active:scale-[0.98] transition-transform">
          <GoPlus className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}
