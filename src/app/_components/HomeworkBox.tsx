import Image from 'next/image'
import { useState } from 'react'
import { api } from '~/trpc/react'

type HomeworkProps = {
    id?: string
    title: string
    body: string
    isEdit?: boolean
    newHomework?: boolean
    onSubmit?: () => void
}

export default function HomeworkBox({
    id,
    title,
    body,
    isEdit,
    newHomework,
    onSubmit
}: HomeworkProps) {
    const [edit, setEdit] = useState(isEdit)
    const [editTitle, setEditTitle] = useState(title)
    const [editBody, setEditBody] = useState(body)

    const utils = api.useUtils()

    const addHomework = api.homework.addHomework.useMutation({
        onSettled: () => {
            void utils.homework.getHomework.invalidate()
        }
    })

    const removeHomework = api.homework.removeHomework.useMutation({
        onSettled: () => {
            void utils.homework.getHomework.invalidate()
        }
    })

    return (
        <div className="flex h-40 w-full flex-col gap-2 rounded-lg bg-[#664A66] p-3">
            {edit ? (
                <input
                    className="rounded bg-[#3A2B3A] text-xl"
                    value={editTitle}
                    onChange={e => {
                        setEditTitle(e.target.value)
                        console.log(1)
                    }}
                ></input>
            ) : (
                <div>{title}</div>
            )}
            <div className="flex h-full gap-2">
                {edit ? (
                    <input
                        className="w-full rounded bg-[#3A2B3A] text-xl"
                        value={editBody}
                        onChange={e => setEditBody(e.target.value)}
                    ></input>
                ) : (
                    <div className="w-full">{body}</div>
                )}
                <div className="flex items-end">
                    {edit ? (
                        <div>
                            <button
                                onClick={() => {
                                    setEdit(false)
                                    onSubmit?.()
                                    if (id) removeHomework.mutate({ id })
                                }}
                            >
                                <Image
                                    src={'/remove.svg'}
                                    alt="remove"
                                    width={20}
                                    height={20}
                                />
                            </button>
                            <button
                                onClick={() => {
                                    setEdit(false)
                                    onSubmit?.()
                                    if (
                                        editTitle.length === 0 ||
                                        editBody.length === 0 ||
                                        (editTitle === title &&
                                            editBody === body)
                                    )
                                        return

                                    addHomework.mutate({
                                        id: id,
                                        discipline: editTitle,
                                        body: editBody
                                    })
                                }}
                            >
                                <Image
                                    src={'/confirm.png'}
                                    alt="confirm"
                                    width={20}
                                    height={20}
                                />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setEdit(true)}>
                            <Image
                                src={'/write.png'}
                                alt="write"
                                width={20}
                                height={20}
                            />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
