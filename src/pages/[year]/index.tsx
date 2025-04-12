"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useData } from '@/context/DataProvider'
import { MonthlyExpenses, Expense } from '@/types/types'
import Link from 'next/link'
import { monthNames } from '@/utils/utils'
import ReturnLink from '@/components/ReturnLink'
import ThemeToggle from '@/components/ThemeToogle'

const ChosenYear = () => {
  const { data, fetchData } = useData()
  const router = useRouter();
  const { year } = router.query;
  const [yearData, setYearData] = useState<MonthlyExpenses | null>(null)

  // Pobieranie danych
  useEffect(() => {
    if (!data) {
      fetchData();
      console.log("Po pobraniu danych:", data);
    }

    if (data && year) {
      setYearData(data[Number(year)])
    }

  }, [data, fetchData, year]);

  return (
    <div className='relative h-dvh flex items-center justify-center lg:text-xl'>
      <ReturnLink />
      {yearData && (
        <ul className='grid grid-cols-3 gap-3 md:gap-5 place-items-center'>
          {Object.entries(yearData).map(([month, days]) => {
            let totalExpenses = 0
            Object.entries(days).map(([_, expenses]) => {
              expenses.map((expense: Expense) => {
                totalExpenses += expense.price
              })
            })
            return (
              <Link href={`${router.asPath}/${monthNames[Number(month)]}`} className='min-w-32 min-h-20 flex items-center justify-center flex-col gap-2 border-2 border-gray-500 rounded-lg p-2 hover:scale-105 active:scale-95 transition-all cursor-pointer' key={month}>
                <span>{monthNames[Number(month)]}</span>
                <span>{totalExpenses.toFixed(2)} zł</span>
              </Link>
            )
          })}
        </ul>
      )}
      <ThemeToggle />
    </div>
  )
}

export default ChosenYear;