import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { groups, userTable } from '~/server/db/schema'
import getTelegramUser from '~/server/logic/getTelegramUser'
import { type db } from '~/server/db'

/**
 * Инкапсулирует операции, связанные с «текущим» пользователем.
 *
 * @example
 * ```ts
 * const cu = new CurrentUser(ctx.db, ctx.session.user.id)
 * await cu.addGroup('42')
 * const me = await cu.getUser()
 * ```
 */
export class CurrentUser {
    /**
     * @param database     - Инстанс базы данных (Drizzle-ORM).
     * @param userId - Идентификатор пользователя из сессии.
     */
    constructor(
        private readonly database: typeof db,
        private readonly userId: number
    ) {}

    /**
     * Пивязывает пользователя к группе.
     *
     * @param groupId - Идентификатор группы.
     * @throws TRPCError – если пользователь не найден.
     */
    async addGroup(groupId: string): Promise<void> {
        const res = await this.database
            .update(userTable)
            .set({ groupId })
            .where(eq(userTable.id, this.userId))

        // В Drizzle rowCount может отсутствовать в типаже,
        // поэтому используем явную проверку «нулевого» результата.
        if (!('rowCount' in res) || res.rowCount === 0) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `User ${this.userId} not found`
            })
        }
    }

    /**
     * Возвращает запись о текущем пользователе.
     *
     * @returns Объект `{ id, groupId }`.
     * @throws TRPCError – если пользователь не найден.
     */
    async getUser(): Promise<{ id: number; groupId: string | null }> {
        const user = await this.database.query.userTable.findFirst({
            where: eq(userTable.id, this.userId),
            columns: { id: true, groupId: true }
        })

        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `User ${this.userId} not found`
            })
        }

        return user
    }

    /**
     * Получает участников группы вместе с ролями.
     *
     * @param groupId - Идентификатор группы.
     * @returns
     * - `null`, если `groupId` не передан;
     * - массив объектов `{ id, groupId, name, role }`, если группа найдена.
     * @throws TRPCError – если группа не найдена.
     */
    async getGroup(groupId: string): Promise<
        | null
        | {
              id: number
              groupId: string | null
              name: string | undefined
              role: 'Староста' | 'Участник'
          }[]
    > {
        if (!groupId) return null

        const groupUsers = await this.database.query.userTable.findMany({
            where: eq(userTable.groupId, groupId),
            columns: { id: true, groupId: true }
        })

        const group = await this.database.query.groups.findFirst({
            where: eq(groups.id, groupId)
        })

        if (!group) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Group ${groupId} not found`
            })
        }

        // Формируем список с именами из Telegram и ролями
        return Promise.all(
            groupUsers.map(async u => {
                const tgUser = await getTelegramUser(u.id)
                return {
                    ...u,
                    name: tgUser?.first_name ?? tgUser?.username,
                    role: group.elderId === u.id ? 'Староста' : 'Участник'
                }
            })
        )
    }
}
