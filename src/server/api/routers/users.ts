import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { CurrentUser } from '~/server/services/current-user'

/**
 * Роутер, инкапсулирующий операции над пользователями.
 * @module usersRouter
 * @remarks
 * Экспортируется как часть API-слоя tRPC.
 */
export const usersRouter = createTRPCRouter({
    /**
     * Привязывает текущего пользователя к группе.
     *
     * @remarks
     * **Mutation**
     *
     * @param input.groupId - Идентификатор группы.
     * @throws TRPCError – если пользователь не найден.
     * @example
     * ```ts
     * await trpc.users.addGroup.mutate({ groupId: '42' })
     * ```
     */
    addGroup: protectedProcedure
        .input(z.object({ groupId: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const user = new CurrentUser(ctx.db, ctx.session.user.id)
            await user.addGroup(input.groupId)
        }),

    /**
     * Возвращает текущего пользователя.
     *
     * @remarks
     * **Query**
     *
     * @returns Объект с полями `{ id, groupId }`.
     * @throws TRPCError – если пользователь не найден.
     */
    getUser: protectedProcedure.query(async ({ ctx }) => {
        const user = new CurrentUser(ctx.db, ctx.session.user.id)
        const userData = await user.getUser()

        return userData
    }),

    /**
     * Получает участников группы и их роли.
     *
     * @remarks
     * **Query**
     *
     * @param input.groupId - Идентификатор группы.
     * @returns Массив объектов `{ id, groupId, name, role }`.
     * @throws TRPCError – если группа не найдена.
     */
    getGroup: protectedProcedure
        .input(z.object({ groupId: z.string() }))
        .query(async ({ ctx, input }) => {
            const user = new CurrentUser(ctx.db, ctx.session.user.id)
            const groupUsersWithName = await user.getGroup(input.groupId)

            return groupUsersWithName
        })
})
