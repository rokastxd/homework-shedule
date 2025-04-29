import { varchar, doublePrecision } from 'drizzle-orm/pg-core'
import { groups } from '../schema'
import { relations } from 'drizzle-orm'
import { createTable } from '../createTable'

export const userTable = createTable("user", {
    id: doublePrecision("id").primaryKey().notNull(),
    groupId: varchar('group_id', { length: 255 })
})

export const usersRelations = relations(userTable, ({ one }) => ({
    group: one(groups, {
        fields: [userTable.groupId],
        references: [groups.id]
    })
}))
