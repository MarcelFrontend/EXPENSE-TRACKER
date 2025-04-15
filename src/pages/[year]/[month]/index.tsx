"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useData } from '@/context/DataProvider'
import { DailyExpenses, Expense } from '@/types/types'
import { hoverActiveAnim, monthNames } from '@/utils/utils'
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

    const bgStyles = "bg-blue-50 hover:bg-blue-100 dark:bg-gradient-to-tr dark:from-[rgb(15,15,15)] dark:hover:from-gray-950 dark:to-[rgb(40,0,80)] dark:hover:to-[rgb(45,0,90)]"
    const shadowStyles = "shadow-[0px_0px_4px_1px_rgb(100,100,200)] hover:shadow-[0px_0px_8px_2px_rgb(175,175,250)] dark:shadow-[inset_0px_0px_7px_2px_rgb(0,0,0)]"
    const borderStyles = "border-2 border-blue-700 dark:border-purple-800 dark:hover:border-purple-500"

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

    return (
        <div className='h-dvh flex items-center justify-center md:text-lg text-gray-600 dark:text-gray-300'>
            <ReturnLink linkTo={`/${year}`} />
            {monthData && (
                <ul className='grid grid-cols-7 gap-1 md:gap-2.5 place-items-center'>
                    {
                        days.map(day => {
                            let totalExpenses = 0
                            if (monthData[day]) {
                                monthData[day].forEach((expense: Expense) => {
                                    totalExpenses += expense.price
                                })
                            }
                            return (
                                <Link
                                    href={`${router.asPath}/${day}`}
                                    key={day}
                                    className={`relative md:size-20 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-gray-100 rounded-md ${borderStyles} ${shadowStyles} ${bgStyles} duration-300 ${hoverActiveAnim}`}>
                                    <span>
                                        {totalExpenses.toFixed(2)} zł
                                    </span>
                                    <span className='absolute bottom-0 right-1 md:text-sm'>
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
