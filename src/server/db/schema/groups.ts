import { doublePrecision, varchar } from 'drizzle-orm/pg-core'
import { userTable } from '../schema'
import { relations } from 'drizzle-orm'
import { createTable } from '../createTable'

export const groups = createTable('groups', {
    id: varchar('id').primaryKey(),
    nameGroup: varchar('name_group').notNull(),
    elderId: doublePrecision('elder_id').notNull()
})

export const groupsRelations = relations(groups, ({ one, many }) => ({
    users: many(userTable),
    elder: one(userTable, {
        fields: [groups.elderId],
        references: [userTable.id]
    })
}))
