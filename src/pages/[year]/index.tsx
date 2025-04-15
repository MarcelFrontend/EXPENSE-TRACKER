"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useData } from '@/context/DataProvider'
import { MonthlyExpenses, Expense } from '@/types/types'
import Link from 'next/link'
import { hoverActiveAnim, monthNames } from '@/utils/utils'
import ReturnLink from '@/components/ReturnLink'
import ThemeToggle from '@/components/ThemeToogle'

const ChosenYear = () => {
  const { data, fetchData } = useData()
  const router = useRouter()
  const { year } = router.query
  const [yearData, setYearData] = useState<MonthlyExpenses | null>(null)

  const bgStyles = "dark:bg-gradient-to-tr bg-blue-50 hover:bg-blue-100 dark:from-[rgb(50,10,80)] dark:hover:from-[rgb(50,10,80)] dark:to-slate-950 dark:hover:to-slate-900"
  const shadowStyles = "shadow-[0px_2px_5px_1px_rgb(200,200,255)] hover:shadow-[0px_0px_10px_1px_rgb(200,200,255)] dark:shadow-[inset_0px_0px_10px_5px_rgb(0,0,0)]"

  useEffect(() => {
    if (!data) {
      fetchData()
    }

    if (data && year) {
      setYearData(data[Number(year)])
    }
  }, [data, fetchData, year])

  return (
    <div className='relative h-dvh flex items-center justify-center md:text-lg text-gray-800 dark:text-gray-300'>
      <ReturnLink />
      {yearData && (
        <ul className='grid place-items-center grid-cols-3 gap-3 md:gap-5'>
          {Object.entries(yearData).map(([month, days]) => {
            let totalExpenses = 0
            Object.values(days).forEach((expenses) => {
              expenses.forEach((expense: Expense) => {
                totalExpenses += expense.price
              })
            })

            return (
              <Link
                href={`${router.asPath}/${monthNames[Number(month)]}`}
                className={`relative max-md:min-w-24 max-md:text-sm md:min-w-36 flex items-center justify-center flex-col gap-1 dark:hover:text-gray-100 ${bgStyles} ${shadowStyles} border-2 border-blue-500 dark:border-purple-800 dark:hover:border-purple-500 rounded-lg pt-2 pb-3.5 duration-300 ${hoverActiveAnim}`}
                key={month}>
                <span className='tracking-wider'>{monthNames[Number(month)]}</span>
                <span className='font-bold'>{totalExpenses.toFixed(2)} zł</span>
                <div className={`absolute top-1 right-1 size-2 md:size-3.5 rounded-full border border-black ${totalExpenses < 100
                    ? 'bg-green-500'
                    : totalExpenses < 200
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`} />
              </Link>
            )
          })}
        </ul>
      )}
      <ThemeToggle />
    </div>
  )
}

export default ChosenYear