import Link from 'next/link'
import React from 'react'

interface ReturnLinkProps {
    linkTo?: string;
    disabled?: boolean
}

const ReturnLink: React.FC<ReturnLinkProps> = ({ linkTo = "/", disabled = false }) => {
    const styles = `absolute max-md:bottom-3 max-md:right-8 md:top-3 md:left-8 border-2 dark:border-gray-600 dark:bg-gray-700 dark:shadow-[inset_0px_0px_5px_1px_rgb(35,35,35)] px-6 py-1 rounded-md transition-all duration-300 ${disabled ? "pointer-events-none" : "dark:active:bg-gray-800 hover:scale-105 active:scale-95"}`
    return (
        disabled ?
            <span className={styles}>Wróć</span>
            :
            <Link href={linkTo} className={styles}>
                Wróć
            </Link>
    )
}

export default ReturnLink
