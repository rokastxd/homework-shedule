import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { groups, userTable } from '~/server/db/schema'
import getTelegramUser from '~/server/logic/getTelegramUser'

export const usersRouter = createTRPCRouter({
    addGroup: protectedProcedure
        .input(z.object({ groupId: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db
                .update(userTable)
                .set({
                    groupId: input.groupId
                })
                .where(eq(userTable.id, ctx.session.user.id))
        }),

    getUser: protectedProcedure.query(async ({ ctx }) => {
        const user = await ctx.db.query.userTable.findFirst({
            where: eq(userTable.id, ctx.session.user.id),
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
        .input(z.object({ groupId: z.string() }))
        .query(async ({ ctx, input }) => {
            if (!input.groupId) return null

            const groupUsers = await ctx.db.query.userTable.findMany({
                where: eq(userTable.groupId, input.groupId),
                columns: { id: true, groupId: true }
            })

            const group = await ctx.db.query.groups.findFirst({
                where: eq(groups.id, input.groupId)
            })

            if (!groupUsers) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Failed to find group'
                })
            }

            const groupUsersWithName = await Promise.all(
                groupUsers.map(async g => {
                    const tgUser = await getTelegramUser(g.id)
                    const role =
                        group?.elderId === g.id ? 'Староста' : 'Участник'
                    return {
                        ...g,
                        name: tgUser?.first_name ?? tgUser?.username,
                        role: role
                    }
                })
            )

            return groupUsersWithName
        }),

    getSecretMessage: protectedProcedure.query(() => {
        return 'you can now see this secret message!'
    })
})
