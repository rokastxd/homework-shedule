'use client'

import { init } from '@telegram-apps/sdk-react'
import { useEffect } from 'react'
import { TRPCReactProvider } from '~/trpc/react'
import TelegramAuth from './_components/TelegramAuth'

type Props = {
    children?: React.ReactNode
}

export const Providers = ({ children }: Props) => {
    useEffect(() => {
        init()
    }, [])

    return (
        <TRPCReactProvider>
            <TelegramAuth>{children}</TelegramAuth>
        </TRPCReactProvider>
    )
}
