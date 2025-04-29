import { varchar, date, timestamp } from 'drizzle-orm/pg-core'
import { createTable } from '../createTable'
import { groups } from './groups'
import { relations } from 'drizzle-orm'

export const homework = createTable('homework', {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    discipline: varchar('discipline').notNull(),
    groupId: varchar('group_id').notNull(),
    body: varchar('body').notNull(),
    createdAt: timestamp('created_at').notNull(),
    deadline: timestamp('deadline').notNull()
})

export const homeworkRelations = relations(homework, ({ one }) => ({
    group: one(groups, {
        fields: [homework.groupId],
        references: [groups.id]
    })
}))
