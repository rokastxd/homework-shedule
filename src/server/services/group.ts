import { eq } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { TRPCError } from '@trpc/server'

import { groups, userTable } from '~/server/db/schema'
import { type db } from '~/server/db'

/**
 * Сервис для операций над группами.
 *
 * @example
 * ```ts
 * const gs = new GroupsService(ctx.db, ctx.session.user.id, ctx.session.user.groupId)
 * const id = await gs.addGroup('Моя группа')
 * const name = await gs.getGroup()
 * ```
 */
export class GroupsService {
    /**
     * @param database       - Инстанс базы данных (Drizzle-ORM).
     * @param userId   - ID текущего пользователя.
     * @param groupId  - ID группы из сессии (может быть `null`).
     */
    constructor(
        private readonly database: typeof db,
        private readonly userId: number,
        private groupId: string | null
    ) {}

    /**
     * Создаёт новую группу и делает текущего пользователя старостой.
     *
     * @param groupName - Человекочитаемое имя группы.
     * @returns Идентификатор созданной группы.
     * @throws TRPCError – если запись пользователя не была обновлена.
     */
    async addGroup(groupName: string): Promise<string> {
        const newGroupId = createId()

        // 1) вставляем группу
        await this.database.insert(groups).values({
            id: newGroupId,
            nameGroup: groupName,
            elderId: this.userId
        })

        // 2) обновляем пользователя
        const res = await this.database
            .update(userTable)
            .set({ groupId: newGroupId })
            .where(eq(userTable.id, this.userId))

        if (!('rowCount' in res) || res.rowCount === 0) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `User ${this.userId} not found`
            })
        }

        // сохраняем в поле класса, чтобы метод getGroup мог использовать
        this.groupId = newGroupId
        return newGroupId
    }

    /**
     * Возвращает имя группы, в которой состоит пользователь.
     *
     * @returns Название группы или `null`, если пользователь вне группы.
     * @throws TRPCError – если группа не найдена по `groupId`.
     */
    async getGroup(): Promise<string | null> {
        if (!this.groupId) return null

        const group = await this.database.query.groups.findFirst({
            where: eq(groups.id, this.groupId),
            columns: { nameGroup: true }
        })

        if (!group) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Group ${this.groupId} not found`
            })
        }

        return group.nameGroup
    }
}
