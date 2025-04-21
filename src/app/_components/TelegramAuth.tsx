'use client'

import { postEvent, initData } from '@telegram-apps/sdk-react'
import { useSession, signIn } from 'next-auth/react'
import { type PropsWithChildren, useEffect } from 'react'

export default function TelegramAuth(props: PropsWithChildren) {
    useEffect(() => {
        initData.restore()
        postEvent('web_app_expand')
    }, [])

    useSession({
        required: true,
        onUnauthenticated() {
            void signIn('credentials', {
                initDataRaw: initData.raw()
            })
        }
    })

    return <>{props.children}</>
}
