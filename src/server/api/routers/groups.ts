import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { GroupsService } from '~/server/services/group'

export const groupsRouter = createTRPCRouter({
    addGroup: protectedProcedure
        .input(z.object({ group_name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const group = new GroupsService(
                ctx.db,
                ctx.session.user.id,
                ctx.session.user.groupId
            )
            await group.addGroup(input.group_name)
        }),
    getGroup: protectedProcedure.query(async ({ ctx }) => {
        const group = new GroupsService(
            ctx.db,
            ctx.session.user.id,
            ctx.session.user.groupId
        )
        const groupUsersWithName = await group.getGroup()

        return groupUsersWithName
    })
})
