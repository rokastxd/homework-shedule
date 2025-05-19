import { eq } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { TRPCError } from '@trpc/server'

import { groups, homework } from '~/server/db/schema'
import { type db } from '~/server/db'

/**
 * Сервис для управления домашними заданиями.
 *
 * @example
 * ```ts
 * const hs = new HomeworkService(ctx.db, ctx.session.user.id, ctx.session.user.groupId)
 * await hs.addHomework({ discipline: 'Math', body: '§4 ex. 2' })
 * const list = await hs.getHomework()
 * await hs.removeHomework(list[0].id)
 * ```
 */
export class HomeworkService {
    /**
     * @param database       - Инстанс базы данных (Drizzle-ORM).
     * @param userId   - ID текущего пользователя.
     * @param groupId  - ID группы, полученный из сессии (`null`, если нет группы).
     */
    constructor(
        private readonly database: typeof db,
        private readonly userId: number,
        private readonly groupId: string | null
    ) {}

    /**
     * Создаёт или обновляет запись о домашнем задании.
     *
     * @param params.id         - ID существующего задания (если хотим обновить).
     * @param params.discipline - Дисциплина.
     * @param params.body       - Текст задания.
     * @throws TRPCError `UNAUTHORIZED` – если пользователь не состоит в группе.
     * @throws TRPCError `NOT_FOUND`    – если при обновлении задание не найдено.
     */
    async addHomework(params: {
        id?: string
        discipline: string
        body: string
    }): Promise<void> {
        if (!this.groupId) {
            throw new TRPCError({ code: 'UNAUTHORIZED' })
        }

        if (params.id) {
            // обновляем
            const res = await this.database
                .update(homework)
                .set({ discipline: params.discipline, body: params.body })
                .where(eq(homework.id, params.id))

            if (!('rowCount' in res) || res.rowCount === 0) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `Homework ${params.id} not found`
                })
            }
        } else {
            // создаём
            await this.database.insert(homework).values({
                id: createId(),
                discipline: params.discipline,
                groupId: this.groupId,
                body: params.body,
                createdAt: new Date(),
                deadline: new Date()
            })
        }
    }

    /**
     * Возвращает все задания группы текущего пользователя.
     *
     * @returns Массив заданий или `null`, если пользователь вне группы.
     * @throws TRPCError `NOT_FOUND` – если группа не существует.
     */
    async getHomework(): Promise<
        | null
        | {
              id: string
              discipline: string
              body: string
              deadline: Date
              createdAt: Date
          }[]
    > {
        if (!this.groupId) return null

        // убеждаемся, что группа есть
        const group = await this.database.query.groups.findFirst({
            where: eq(groups.id, this.groupId)
        })
        if (!group) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Group ${this.groupId} not found`
            })
        }

        // получаем задания
        return this.database.query.homework.findMany({
            where: eq(homework.groupId, this.groupId),
            columns: {
                id: true,
                discipline: true,
                body: true,
                deadline: true,
                createdAt: true
            }
        })
    }

    /**
     * Удаляет задание по ID.
     *
     * @param id - Идентификатор задания.
     */
    async removeHomework(id: string): Promise<void> {
        await this.database.delete(homework).where(eq(homework.id, id))
    }
}
