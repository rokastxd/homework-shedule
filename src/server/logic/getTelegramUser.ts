import { z } from 'zod'

const telegramUserSchema = z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string().optional().default(''),
    username: z.string().optional().default(''),
    is_premium: z.boolean().optional().default(false)
})

const telegramUserResponseSchema = z.object({
    ok: z.boolean(),
    result: z
        .object({
            user: telegramUserSchema
        })
        .optional()
})

async function getTelegramUser(userId: string) {
    try {
        const getChatResponse = await fetch(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember?chat_id=${userId}&user_id=${userId}`
        )

        const data: unknown = await getChatResponse.json()
        const parsedData = telegramUserResponseSchema.parse(data)

        if (!parsedData.ok || !parsedData.result) {
            throw new Error(`API error! description: ${JSON.stringify(data)}`)
        }

        return { ...parsedData.result.user }
    } catch (e) {
        if (typeof e === 'object' && e !== null && 'message' in e) {
            console.error(e.message)
        }
        return null
    }
}

export default getTelegramUser
