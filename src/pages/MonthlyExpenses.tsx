import { useState, useEffect } from "react";
import { GoArrowLeft } from "react-icons/go";
import { GoGear } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import DailyExpense from "./DailyExpense";

export default function MonthlyExpenses({
  chosenYear,
  goBackToYearSelection,
}: {
  chosenYear: number;
  goBackToYearSelection: () => void;
}) {
  const months = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];
  const [monthlyExpenses, setMonthlyExpenses] = useState<number[]>([]);
  const [showMonthExpenses, setShowMonthExpenses] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const generateMonthExpense = () => {
    let expense;
    do {
      expense = Math.floor(Math.random() * 1000);
    } while (expense > 156 || expense < 60);
    return expense;
  };

  useEffect(() => {
    const generatedMonthlyExpenses = Array.from(
      { length: months.length },
      generateMonthExpense
    );
    setMonthlyExpenses(generatedMonthlyExpenses);
  }, []);

  const handleMonthClick = (index: number) => {
    setSelectedMonth(index);
    setShowMonthExpenses(true);
  };

  const handleBackClick = () => {
    if (showMonthExpenses) {
      setShowMonthExpenses(false);
      setSelectedMonth(null);
    } else {
      goBackToYearSelection();
    }
  };

  const addNewExpenseInMonths = () => {
    alert("This will be added");
  };

  return (
    <div className="relative h-screen flex flex-col overflow-y-hidden">
      <nav className="w-screen h-10 flex items-center justify-between px-2">
        <GoArrowLeft onClick={handleBackClick} className="w-8 h-8" />
        <span className="sticky top-1 text-2xl p-2 text-green-500 font-bold">
          {chosenYear}
        </span>
        <GoGear className="w-7 h-7" />
      </nav>
      <main className="relative flex-grow flex items-center justify-center flex-col gap-2 overflow-hidden">
        <div className="w-screen">
          {!showMonthExpenses ? (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-4 px-2 md:px-0">
              {months.map((month, index) => (
                <button
                  onClick={() => handleMonthClick(index)}
                  key={month}
                  className="min-w-36 flex items-center justify-between gap-2 px-2 py-1 text-lg lg:text-3xl border-2 border-green-500 rounded-md cursor-pointer hover:scale-105 transition-transform active:scale-95"
                >
                  <span>{month}</span>
                  <span
                    className={`${
                      monthlyExpenses[index] > 120
                        ? "text-red-500 font-black"
                        : monthlyExpenses[index] > 80
                        ? "text-yellow-400"
                        : "text-green-500"
                    } tracking-wide`}
                  >
                    {monthlyExpenses[index] + "zł" || "Błąd"}
                  </span>
                </button>
              ))}
            </ul>
          ) : (
            selectedMonth !== null && (
              <DailyExpense monthIndex={selectedMonth} currentYear={chosenYear} />
            )
          )}
        </div>
      </main>
      <button
        onClick={addNewExpenseInMonths}
        className="w-[calc(100vw-25px)] md:w-[calc(100vw-50px)] flex items-center justify-center mx-3 mb-3 rounded-full bg-green-500 hover:scale-105 active:scale-[0.98] transition-transform"
      >
        <GoPlus className="w-10 h-10" />
      </button>
    </div>
  );
}
