import { varchar } from "drizzle-orm/pg-core";
import { users } from "../schema";
import { relations } from "drizzle-orm";
import { createTable } from "../createTable";

export const groups = createTable("groups", {
  id: varchar("id").primaryKey(),
  nameGroup: varchar("name_group").notNull(),
  elderId: varchar("elder_id").notNull(),
});

export const groupsRelations = relations(groups, ({ one, many }) => ({
  users: many(users),
  elder: one(users, {
    fields: [groups.elderId],
    references: [users.id],
  }),
}));
