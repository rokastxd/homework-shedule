import { api } from '~/trpc/react'

export default function Group() {
    //const user = api.users.getUser.useQuery()

    // const usersGroup = api.users.getGroup.useQuery({
    //     groupId: user.data?.groupId ?? ''
    // })
    return (
        <main>
            <div>Group</div>
            {/* {usersGroup.data?.map(g => <div key={g.id}>{g.name}</div>)} */}
        </main>
    )
}
