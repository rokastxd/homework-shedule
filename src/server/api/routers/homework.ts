import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { createId } from '@paralleldrive/cuid2'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { groups, homework } from '~/server/db/schema'
import { TRPCError } from '@trpc/server'

export const homeworkRouter = createTRPCRouter({
    addHomework: protectedProcedure
        .input(
            z.object({
                id: z.string().optional(),
                discipline: z.string(),
                body: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session?.user.groupId) {
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            }

            if (input.id) {
                await ctx.db
                    .update(homework)
                    .set({
                        discipline: input.discipline,
                        body: input.body
                    })
                    .where(eq(homework.id, input.id))
            } else {
                await ctx.db.insert(homework).values({
                    id: createId(),
                    discipline: input.discipline,
                    groupId: ctx.session.user.groupId,
                    body: input.body,
                    createdAt: new Date(),
                    deadline: new Date()
                })
            }
        }),
    getHomework: protectedProcedure.query(async ({ ctx }) => {
        if (!ctx.session?.user.groupId) {
            throw new TRPCError({ code: 'UNAUTHORIZED' })
        }

        const group = await ctx.db.query.groups.findFirst({
            where: eq(groups.id, ctx.session.user.groupId)
        })

        if (!group) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Failed to find group'
            })
        }

        const myHomework = await ctx.db.query.homework.findMany({
            where: eq(homework.groupId, ctx.session.user.groupId),
            columns: {
                id: true,
                discipline: true,
                body: true,
                deadline: true,
                createdAt: true
            }
        })

        return myHomework
    }),
    removeHomework: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(homework).where(eq(homework.id, input.id))
        })
})
