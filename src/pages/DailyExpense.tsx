export default function DailyExpense({ monthIndex, currentYear }: { monthIndex: number,currentYear:number }) {
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate()

    const generateDayExpense = () => {
        let expense;
        do {
            expense = Math.floor(Math.random() * 1000);
        } while (expense > 60 || expense < 8) {
            return expense;
        }
    }

    const dailyExpenses = Array.from({ length: daysInMonth }, generateDayExpense)

    return (
        <ul className="max-w-[17rem] md:max-w-[31rem] mx-auto grid grid-cols-5 md:grid-cols-7 select-none">
            {dailyExpenses.map((expense, day) => (
                <li key={day} className={`w-14 h-14 md:w-20 md:h-20 border ${expense > 50 ? "bg-red-400 font-black" : expense > 30 ? "bg-yellow-400/95" : "bg-green-500"} tracking-wide text-black hover:opacity-90 active:opacity-75 transition-opacity cursor-pointer flex items-center justify-center`}>
                    {expense}zł
                </li>
            ))}
        </ul>
    )
} 