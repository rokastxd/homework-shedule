import Image from 'next/image'

const group = [
    { name: 'Пустовалов Д.Э.', groupName: 'Староста' },
    { name: 'Валитов Т.Р.', groupName: 'Участник группы' },
    { name: 'Бормотов Р.А.', groupName: 'Участник группы' },
    { name: 'Смирнов В.С.', groupName: 'Участник группы' },
    { name: 'Пиантковский И.А.', groupName: 'Участник группы' }
]

export default function Group() {
    //const user = api.users.getUser.useQuery()

    // const usersGroup = api.users.getGroup.useQuery({
    //     groupId: user.data?.groupId ?? ''
    // })
    return (
        <main className="flex h-full w-full grow flex-col items-center gap-4 p-2">
            <div className="text-2xl font-semibold">Учебная группа</div>
            <div className="w-full rounded-bl-xl rounded-tr-2xl border-2 border-white bg-[#664A66]">
                <div className="border-b-2 border-white p-4 text-center font-bold">
                    ИНБО-31-23
                </div>
                {group.map((g, i) => (
                    <div
                        key={g.name}
                        className={
                            'flex h-9 items-center border-white' +
                            (group.length === i + 1 ? '' : ' border-b-2')
                        }
                    >
                        <div className="h-full w-1/2 content-center border-r-2 border-white pl-2">
                            {g.name}
                        </div>
                        <div className="h-full w-1/2 content-center pl-2">
                            {g.groupName}
                        </div>
                        <Image
                            src={'remove.svg'}
                            alt="img"
                            width={20}
                            height={20}
                            className="m-2"
                        />
                    </div>
                ))}
            </div>
        </main>
    )
}
