import { varchar, date } from 'drizzle-orm/pg-core'
import { createTable } from '../createTable'
import { groups } from './groups'
import { relations } from 'drizzle-orm'

export const homework = createTable('homework', {
    discipline: varchar('discipline').primaryKey(),
    groupId: varchar('group_id').notNull(),
    body: varchar('body').notNull(),
    deadline: date('deadline').notNull(),
    createdAt: date('created_at').notNull()
})

export const homeworkRelations = relations(homework, ({ one }) => ({
    group: one(groups, {
        fields: [homework.groupId],
        references: [groups.id]
    })
}))
