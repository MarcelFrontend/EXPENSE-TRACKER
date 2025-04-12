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

    const [monthData, setMonthData] = useState<DailyExpenses | null>(null)

    // Pobieranie danych
    useEffect(() => {
        if (!data) {
            fetchData();
        }

        if (data && month) {
            const chosenYear = data[Number(year)];
            const monthIndex = monthNames.indexOf(String(month));
            setMonthData(chosenYear[monthIndex]);
        }

    }, [data, fetchData, month]);

    return (
        <div className='h-dvh flex items-center justify-center'>
            <ReturnLink linkTo={`/${year}`} />
            {monthData && (
                <ul className='grid grid-cols-7 gap-1 place-items-center'>
                    {
                        Array.from({ length: numberOfDaysInMonth }, (_, index) => {
                            const day = index + 1;
                            let totalExpenses = 0;

                            if (monthData[day]) {
                                monthData[day].forEach((expense: Expense) => {
                                    totalExpenses += expense.price;
                                });
                            }
                            return (
                                <Link href={`${router.asPath}/${day}`} key={day} className='relative w-16 h-16 flex items-center justify-center border'>
                                    <span className='absolute -bottom-1 right-0'>{day}</span>
                                    <span className=''>{totalExpenses.toFixed(2)} zł</span>
                                </Link>
                            );
                        })
                    }
                </ul>
            )}
            <ThemeToggle />
        </div>
    )
}
export default ChosenYear;