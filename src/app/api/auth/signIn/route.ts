import { eq } from 'drizzle-orm'
import { env } from '~/env'
import { z } from 'zod'
import { db } from '~/server/db'
import { parse, validate } from '@telegram-apps/init-data-node'
import { userTable } from '~/server/db/schema/user'
import {
    createSession,
    generateSessionToken,
    getCurrentSession
} from '~/server/auth/session'
import { setSessionTokenCookie } from '~/server/auth/cookies'

export async function POST(req: Request) {
    if ((await getCurrentSession()).user)
        return Response.json({ info: 'Already logged in' }, { status: 200 })

    const parsedCredentials = z
        .object({
            initDataRaw: z.string().min(1)
        })
        .safeParse(await req.json())

    if (!parsedCredentials.success) {
        return Response.json({ error: 'Invalid credentials' }, { status: 400 })
    }
    const { initDataRaw } = parsedCredentials.data

    let id: number | undefined

    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        validate(initDataRaw, env.BOT_TOKEN)

        id = parse(initDataRaw).user?.id
    } catch (e) {
        return Response.json(
            { error: 'Error validating user init data' },
            { status: 400 }
        )
    }

    if (!id)
        return Response.json({ error: 'Cannot parse user id' }, { status: 400 })

    const user = await db.query.userTable.findFirst({
        where: eq(userTable.id, id)
    })

    if (!user) {
        await db.insert(userTable).values({ id })
    }

    const token = generateSessionToken()
    const session = await createSession(token, id)
    void setSessionTokenCookie(token, session.expiresAt)

    return Response.json({ id }, { status: 200 })
}
