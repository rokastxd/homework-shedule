import pg from 'pg'
import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/node-postgres'

import type { InferSelectModel } from 'drizzle-orm'
import { userTable } from './schema/user'

const pool = new pg.Pool()
const db = drizzle(pool)

export const sessionTable = pgTable('session', {
    id: text('id').primaryKey(),
    userId: integer('user_id')
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: 'date'
    }).notNull()
})

export type User = InferSelectModel<typeof userTable>
export type Session = InferSelectModel<typeof sessionTable>

export * from './schema/user'
export * from './schema/groups'
export * from './schema/homework'
export * from './schema/disciplines'
