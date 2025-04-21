import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { createId } from '@paralleldrive/cuid2'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { groups, users } from '~/server/db/schema'

export const groupsRouter = createTRPCRouter({
    addGroup: protectedProcedure
        .input(z.object({ group_name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const groupId = createId()

            await ctx.db.insert(groups).values({
                id: groupId,
                nameGroup: input.group_name,
                elderId: ctx.session.user.id
            })

            await ctx.db
                .update(users)
                .set({
                    groupId: groupId
                })
                .where(eq(users.id, ctx.session.user.id))
        })
})
