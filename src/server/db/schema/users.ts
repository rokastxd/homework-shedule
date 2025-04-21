import { timestamp, varchar } from 'drizzle-orm/pg-core'
import { groups } from '../schema'
import { relations, sql } from 'drizzle-orm'
import { createTable } from '../createTable'

export const users = createTable('user', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }),
    emailVerified: timestamp('email_verified', {
        mode: 'date',
        withTimezone: true
    }).default(sql`CURRENT_TIMESTAMP`),
    image: varchar('image', { length: 255 }),
    groupId: varchar('group_id', { length: 255 })
})

export const usersRelations = relations(users, ({ one }) => ({
    group: one(groups, {
        fields: [users.groupId],
        references: [groups.id]
    })
}))
