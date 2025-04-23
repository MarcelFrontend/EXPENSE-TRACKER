import Link from 'next/link'
import React from 'react'

interface ReturnLinkProps {
    linkTo?: string;
    disabled?: boolean
}

const hoverActiveAnim = "hover:scale-105 active:scale-95 transition-all"

const ReturnLink: React.FC<ReturnLinkProps> = ({ linkTo = "/", disabled = false }) => {

    const borderStyles = "border-2 border-blue-700 dark:border-purple-800 dark:hover:border-purple-600 rounded-lg"

    const shadowStyles = "dark:shadow-[0px_0px_10px_2px_rgb(60,20,90)] dark:hover:shadow-[0px_0px_10px_2px_rgb(120,20,170)]"

    const styles = `absolute top-3 left-3 px-7 py-1.5 ${borderStyles} text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 bg-white dark:bg-black hover:scale-105 ${shadowStyles} ${disabled ? "pointer-events-none" : `${hoverActiveAnim}`}`

    return (
        disabled ?
            <span className={`${styles}`}>Wróć</span>
            :
            <Link href={linkTo} className={styles}>
                Wróć
            </Link>
    )
}

export default ReturnLink
