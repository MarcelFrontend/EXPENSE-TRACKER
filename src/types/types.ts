
export interface Expense {
    cena: number,
    produkt: string,
    sklep: string
}

export interface DailyExpenses {
    [day: number]: Expense[]
}

export interface MonthlyExpenses {
    [month: string]: DailyExpenses
}

export interface ExpenseTrackerData {
    [year: number]: MonthlyExpenses
}