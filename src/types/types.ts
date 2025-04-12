
export interface Expense {
    price: number,
    product: string,
    source: string
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