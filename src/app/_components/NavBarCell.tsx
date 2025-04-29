'use client'

import { hapticFeedback } from '@telegram-apps/sdk-react'
import Link from 'next/link'
import React, { type FC, type ReactNode } from 'react'

interface RoundedBoxProps {
    children?: ReactNode
    className?: string
    isActive?: boolean
    onClick?: () => void
    href?: string
}

const NavBarCell: FC<RoundedBoxProps> = ({
    children,
    className,
    onClick,
    href
}) => {
    const cName = `
    flex
    w-full
    flex-col
    grow
    basis-0
    h-full
    items-center
    justify-center
    ${!onClick && !href && 'cursor-default'}
    ${className}
    `

    return href ? (
        <Link
            href={href}
            className={cName}
            onClick={() => hapticFeedback.impactOccurred('medium')}
        >
            {children}
        </Link>
    ) : (
        <button
            className={cName}
            onClick={() => hapticFeedback.impactOccurred('medium')}
        >
            {children}
        </button>
    )
}

export default NavBarCell
