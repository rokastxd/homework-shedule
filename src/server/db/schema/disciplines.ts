import { varchar } from "drizzle-orm/pg-core";
import { homework } from "./homework";
import { relations } from "drizzle-orm";
import { createTable } from "../createTable";

export const disciplines = createTable("disciplines", {
  discipline: varchar("discipline").primaryKey(),
});

export const disciplinesRelations = relations(disciplines, ({ one }) => ({
  homework: one(homework, {
    fields: [disciplines.discipline],
    references: [homework.discipline],
  }),
}));
