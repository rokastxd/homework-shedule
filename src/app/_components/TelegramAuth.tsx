'use client'

import { postEvent, initData } from '@telegram-apps/sdk-react'
import { type PropsWithChildren, useEffect } from 'react'

export default function TelegramAuth(props: PropsWithChildren) {
    useEffect(() => {
        initData.restore()
        postEvent('web_app_expand')
        fetch('/api/auth/signIn', { method: 'POST', body: JSON.stringify({initDataRaw: initData.raw()}) })
    }, [])

    return <>{props.children}</>
}
