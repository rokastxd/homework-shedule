'use client'

import Image from 'next/image'
import { api } from '~/trpc/react'
import NavBar from '../_components/NavBar'
import Modal from '../_components/Modal'
import { useState } from 'react'

export default function Group() {
    const user = api.users.getUser.useQuery()
    const groupName = api.groups.getGroup.useQuery()

    const usersGroup = api.users.getGroup.useQuery({
        groupId: user.data?.groupId ?? ''
    })

    const [openModal, setOpenModal] = useState(false)

    return (
        <main className="relative flex min-h-screen w-full flex-col">
            <div className="flex h-full w-full grow flex-col gap-4 p-2">
                <div className="text-2xl font-semibold">Учебная группа</div>
                <div className="w-full rounded-bl-xl rounded-tr-2xl border-2 border-white bg-[#664A66]">
                    <div className="border-b-2 border-white p-4 text-center font-bold">
                        {groupName.data}
                    </div>
                    {usersGroup.data?.map((g, i) => (
                        <div
                            key={g.name}
                            className={
                                'flex h-9 items-center border-white' +
                                (usersGroup.data?.length === i + 1
                                    ? ''
                                    : ' border-b-2')
                            }
                        >
                            <div className="h-full w-1/2 content-center border-r-2 border-white pl-2">
                                {g.name}
                            </div>
                            <div className="h-full w-1/2 content-center pl-2">
                                {g.role}
                            </div>
                            {g.role === 'Староста' && (
                                <Image
                                    src={'remove.svg'}
                                    alt="img"
                                    width={20}
                                    height={20}
                                    className="m-2"
                                />
                            )}
                        </div>
                    ))}
                </div>
                <button onClick={() => setOpenModal(true)} className="mx-auto">
                    <Image src={'/add.svg'} alt="add" width={30} height={30} />
                </button>
            </div>
            {openModal && (
                <Modal closeModal={() => setOpenModal(false)}></Modal>
            )}
            <NavBar />
        </main>
    )
}
