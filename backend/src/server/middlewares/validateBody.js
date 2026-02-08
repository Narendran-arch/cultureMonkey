import { readBody, createError } from 'h3'

export const validateBody = (schema) => {
  return async (event) => {
    try {
      const body = await readBody(event)
      event.context.body = await schema.parseAsync(body)
    } catch (err) {
      const messages = err.errors
        ? err.errors.map(e => e.message).join(', ')
        : err.message

      throw createError({
        statusCode: 400,
        statusMessage: messages,
      })
    }
  }
}
