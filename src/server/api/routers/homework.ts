import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { HomeworkService } from '~/server/services/homework'

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
            const homework = new HomeworkService(
                ctx.db,
                ctx.session.user.id,
                ctx.session.user.groupId
            )
            await homework.addHomework({
                id: input.id,
                discipline: input.discipline,
                body: input.body
            })
        }),
    getHomework: protectedProcedure.query(async ({ ctx }) => {
        const homework = new HomeworkService(
            ctx.db,
            ctx.session.user.id,
            ctx.session.user.groupId
        )
        const myHomework = await homework.getHomework()

        return myHomework
    }),
    removeHomework: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const homework = new HomeworkService(
                ctx.db,
                ctx.session.user.id,
                ctx.session.user.groupId
            )
            await homework.removeHomework(input.id)
        })
})
