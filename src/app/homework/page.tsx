'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '~/trpc/react'
import NavBar from '../_components/NavBar'
import Image from 'next/image'
import HomeworkBox from '../_components/HomeworkBox'

export default function Login() {
    const [newHomework, setNewHomework] = useState(false)

    const user = api.users.getUser.useQuery()
    const homework = api.homework.getHomework.useQuery()

    return (
        <main className="relative flex min-h-screen w-full flex-col">
            <div className="flex grow flex-col items-center gap-12 px-4 py-16">
                {homework.data?.map(h => (
                    <HomeworkBox
                        key={h.id}
                        id={h.id}
                        title={h.discipline}
                        body={h.body}
                        isEdit={false}
                    />
                ))}

                {newHomework && (
                    <HomeworkBox
                        title={''}
                        body={''}
                        isEdit={true}
                        newHomework={newHomework}
                        onSubmit={() => setNewHomework(false)}
                    />
                )}

                <button onClick={() => setNewHomework(true)}>
                    <Image src={'/add.svg'} alt="add" width={50} height={50} />
                </button>
            </div>
            <NavBar />
        </main>
    )
}
