"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useData } from '@/context/DataProvider'
import { DailyExpenses, Expense } from '@/types/types'
import { monthNames } from '@/utils/utils'
import Link from 'next/link'
import ReturnLink from '@/components/ReturnLink'
import ThemeToggle from '@/components/ThemeToogle'

const ChosenYear = () => {
    const { data, fetchData } = useData()
    const router = useRouter();
    const { year, month } = router.query;
    const numberOfDaysInMonth = new Date(Number(year), monthNames.indexOf(String(month)), 0).getDate()
    const days = Array.from({ length: numberOfDaysInMonth }, (_, i) => i + 1)

    const [monthData, setMonthData] = useState<DailyExpenses | null>(null)

    const hoverActiveAnim = "hover:scale-105 active:scale-95 transition-all"

    const bgStyles = "bg-blue-50 dark:bg-gradient-to-tr dark:from-[rgb(15,15,15)] dark:hover:from-gray-950 dark:to-[rgb(40,0,80)] dark:hover:to-[rgb(45,0,90)]"

    const shadowStyles = "dark:shadow-[inset_0px_0px_7px_1px_rgb(0,0,0)]"

    const isTodayStyles = "bg-purple-200 dark:from-blue-950 dark:to-blue-800 dark:hover:from-blue-950 dark:hover:to-blue-700 border-purple-500 hover:border-purple-600 dark:border-blue-700 dark:hover:border-blue-600"

    const borderStyles = "border-2 lg:border-[2.5px]"

    useEffect(() => {
        if (!data) {
            fetchData();
        }

        if (data && month) {
            const chosenYear = data[Number(year)];
            const monthIndex = monthNames.indexOf(String(month));
            setMonthData(chosenYear[monthIndex]);
        }
    }, [data, fetchData, month, year]);

    function dayIndicator(day: number) {
        const dayName = new Date(`${year}-${monthNames.indexOf(String(month)) + 1}-${day}`).toLocaleDateString("en-US", { weekday: 'short' })

        switch (dayName) {
            case "Mon":
                return "shadow-[0px_0px_7px_1px_rgb(100,200,100)] border-green-500 dark:border-green-700 dark:hover:border-green-600"
            case "Sat":
                return "shadow-[0px_0px_7px_1px_rgb(200,200,100)] border-yellow-500 dark:border-yellow-700 dark:hover:border-yellow-600"
            case "Sun":
                return "shadow-[0px_0px_7px_1px_rgb(200,100,100)] border-red-500 dark:border-red-800 dark:hover:border-red-700"
            default:
                return "shadow-[0px_0px_7px_1px_rgb(150,150,250)] hover:shadow-[0px_0px_8px_2px_rgb(175,175,250)]  border-blue-700 dark:border-purple-900 dark:hover:border-purple-700"
        }
    }

    return (
        <div className='h-dvh flex items-center justify-center text-sm md:text-lg lg:text-2xl text-gray-600 dark:text-gray-300'>
            <ReturnLink linkTo={`/${year}`} />
            {monthData && (
                <ul className='grid place-items-center grid-cols-5 md:grid-cols-7 gap-1 md:gap-2.5 lg:gap-4'>
                    {
                        days.map(day => {
                            let isToday = false
                            let totalExpenses = 0
                            const date = new Date()
                            const todayFullDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                            const currentDate = `${year}-${monthNames.indexOf(String(month)) + 1}-${day}`

                            if (todayFullDate == currentDate) {
                                isToday = true
                            }

                            if (monthData[day]) {
                                monthData[day].forEach((expense: Expense) => {
                                    totalExpenses += expense.price
                                })
                            }
                            return (
                                <Link
                                    href={`${router.asPath}/${day}`}
                                    key={day}
                                    className={`relative size-16 md:size-20 lg:size-28 flex items-center justify-center text-black dark:text-gray-300 dark:hover:text-gray-100 rounded-md ${borderStyles} ${shadowStyles} ${bgStyles} duration-300 ${hoverActiveAnim} ${isToday ? `${isTodayStyles}` : `${dayIndicator(day)}`}`}>
                                    <div className={`absolute top-1 right-1 size-2 md:size-3.5 lg:size-4 rounded-full border border-black ${totalExpenses < 60
                                        ? 'bg-green-500'
                                        : totalExpenses < 85
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'
                                        }`} />
                                    <span>
                                        {totalExpenses.toFixed(2)} zł
                                    </span>
                                    <span className='absolute bottom-0 right-1 md:text-sm lg:text-xl'>
                                        {day}
                                    </span>
                                </Link>
                            )
                        })
                    }
                </ul>
            )}
            <ThemeToggle />
        </div>
    )
}
export default ChosenYear
