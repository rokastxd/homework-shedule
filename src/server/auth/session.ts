import { userTable, sessionTable } from '../db/schema'
import { eq } from 'drizzle-orm'
import {
    encodeBase32LowerCaseNoPadding,
    encodeHexLowerCase
} from '@oslojs/encoding'
import { sha256 } from '@oslojs/crypto/sha2'

import type { User, Session } from '../db/schema'
import { db } from '../db'
import { cache } from 'react'
import { cookies } from 'next/headers'

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20)
    crypto.getRandomValues(bytes)
    const token = encodeBase32LowerCaseNoPadding(bytes)
    return token
}

export async function createSession(
    token: string,
    userId: number
): Promise<Session> {
    const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token))
    )
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    }
    await db.insert(sessionTable).values(session)
    return session
}

export async function validateSessionToken(
    token: string
): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token))
    )
    const result = await db
        .select({ user: userTable, session: sessionTable })
        .from(sessionTable)
        .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
        .where(eq(sessionTable.id, sessionId))
    if (!result[0]) {
        return { session: null, user: null }
    }
    const { user, session } = result[0]
    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(sessionTable).where(eq(sessionTable.id, session.id))
        return { session: null, user: null }
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        await db
            .update(sessionTable)
            .set({
                expiresAt: session.expiresAt
            })
            .where(eq(sessionTable.id, session.id))
    }
    return { session, user }
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId))
}

export async function invalidateAllSessions(userId: number): Promise<void> {
    await db.delete(sessionTable).where(eq(sessionTable.userId, userId))
}

export const getCurrentSession = cache(
    async (): Promise<SessionValidationResult> => {
        const cookieStore = await cookies()
        const token = cookieStore.get('session')?.value ?? null
        if (token === null) {
            return { session: null, user: null }
        }
        const result = await validateSessionToken(token)
        return result
    }
)

export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null }
