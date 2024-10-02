import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { GoGear } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import MonthlyExpenses from "./MonthlyExpenses";

export default function Index() {
  const years = [2024, 2025, 2026, 2027, 2028];
  const [isYearChosen, setIsYearChosen] = useState(false);
  const [chosenYear, setChosenYear] = useState<number>(0);

  const handleBackClick = () => {
    setIsYearChosen(false);
    setChosenYear(0);
  };
  const addNewExpenseInYears = () => {
    alert("This will be added");
  };
  return (
    <div>
      {!isYearChosen ? (
        <>
          <div className="relative h-screen flex flex-col overflow-y-hidden">
            <nav className="w-screen h-10 flex items-center justify-between px-2">
              <GoArrowLeft onClick={handleBackClick} className="w-8 h-8" />
              <GoGear className="w-7 h-7" />
            </nav>
            <main className="relative flex-grow flex items-center justify-center flex-col gap-2 overflow-hidden">
              <div className="w-screen">
                <ul className="flex items-center justify-center flex-wrap gap-2 text-green-400 text-4xl">
                  {years.map((year) => (
                    <button
                      className="border px-2 rounded-md"
                      key={year}
                      onClick={() => {
                        setIsYearChosen(true);
                        setChosenYear(year);
                      }}
                    >
                      {year}
                    </button>
                  ))}
                </ul>
              </div>
            </main>
            <button
              onClick={addNewExpenseInYears}
              className="w-[calc(100vw-25px)] md:w-[calc(100vw-50px)] flex items-center justify-center mx-3 mb-3 rounded-full bg-green-500 hover:scale-105 active:scale-[0.98] transition-transform"
            >
              <GoPlus className="w-10 h-10" />
            </button>
          </div>
        </>
      ) : (
        chosenYear !== 0 && (
          <MonthlyExpenses
            chosenYear={chosenYear}
            goBackToYearSelection={handleBackClick}
          />
        )
      )}
    </div>
  );
}
