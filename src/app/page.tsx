'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { api } from '~/trpc/react'

export default function Home() {
    const router = useRouter()
    const user = api.users.getUser.useQuery()

    useEffect(() => {
        if (user.status === 'success' && user.data?.groupId) {
            router.push('/homework')
        }
    }, [user.data, router, user.status])

    const [groupCreate, showGroupCreate] = useState(false)
    const [inputValue, setInputValue] = useState('')

    const utils = api.useUtils()
    const addGroup = api.groups.addGroup.useMutation({
        onSettled: () => {
            void utils.users.getUser.invalidate()
        }
    })

    return (
        <main>
            {user.status === 'success' && !user.data.groupId && (
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                    <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-[5rem]">
                        Вы не состоите в группе
                    </h1>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                        {!groupCreate ? (
                            <button
                                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
                                onClick={() => showGroupCreate(true)}
                            >
                                <h3 className="text-2xl font-bold">
                                    Создать группу →
                                </h3>
                            </button>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="Название группы"
                                    className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
                                    value={inputValue}
                                    onChange={e => {
                                        setInputValue(e.target.value)
                                    }}
                                ></input>
                                <button
                                    className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
                                    onClick={() => {
                                        if (inputValue.length === 0) return

                                        addGroup.mutate({
                                            group_name: inputValue
                                        })

                                        router.push('/group')
                                    }}
                                >
                                    Создать группу
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    )
}
