'use client'

import { init } from '@telegram-apps/sdk-react'
import { useEffect } from 'react'
import { TRPCReactProvider } from '~/trpc/react'
import TelegramAuth from './_components/TelegramAuth'
import { SessionProvider } from 'next-auth/react'

type Props = {
    children?: React.ReactNode
}

export const Providers = ({ children }: Props) => {
    useEffect(() => {
        init()
    }, [])

    return (
        <TRPCReactProvider>
            <SessionProvider>
                <TelegramAuth>{children}</TelegramAuth>
            </SessionProvider>
        </TRPCReactProvider>
    )
}
