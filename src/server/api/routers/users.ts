import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { users } from '~/server/db/schema'
import getTelegramUser from '~/server/logic/getTelegramUser'

export const usersRouter = createTRPCRouter({
    addGroup: protectedProcedure
        .input(z.object({ groupId: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db
                .update(users)
                .set({
                    groupId: input.groupId
                })
                .where(eq(users.id, ctx.session.user.id))
        }),

    getUser: protectedProcedure.query(async ({ ctx }) => {
        const user = await ctx.db.query.users.findFirst({
            where: eq(users.id, ctx.session.user.id),
            columns: { id: true, groupId: true }
        })

        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Failed to find user'
            })
        }

        return user
    }),

    getGroup: protectedProcedure
        .input(z.object({ groupId: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            const group = await ctx.db.query.users.findMany({
                where: eq(users.groupId, input.groupId),
                columns: { id: true, groupId: true }
            })

            if (!group) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Failed to find group'
                })
            }

            const groupWithName = await Promise.all(
                group.map(async g => {
                    const tgUser = await getTelegramUser(g.id)
                    return {
                        ...g,
                        name: tgUser?.first_name ?? tgUser?.username
                    }
                })
            )

            return groupWithName
        }),

    getSecretMessage: protectedProcedure.query(() => {
        return 'you can now see this secret message!'
    })
})
