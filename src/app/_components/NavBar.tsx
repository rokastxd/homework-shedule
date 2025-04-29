'use client'

import React from 'react'
import NavBarCell from './NavBarCell'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export const NavBar = () => {
    const pathname = usePathname()

    return (
        <div
            className={`sticky bottom-0 z-10 flex h-14 w-full select-none items-end gap-2 bg-[#534453] p-2 text-xs font-normal`}
        >
            <NavBarCell isActive={pathname === '/homework'} href="/homework">
                <div className="relative h-full w-full">
                    <Image
                        alt={'homework'}
                        src={'/homework.svg'}
                        fill
                        className="object-contain"
                    />
                </div>
            </NavBarCell>
            <NavBarCell isActive={pathname === '/group'} href="/group">
                <div className="relative h-full w-full">
                    <Image
                        alt={'group'}
                        src={'/group.svg'}
                        fill
                        className="object-contain"
                    />
                </div>
            </NavBarCell>
        </div>
    )
}

export default NavBar
