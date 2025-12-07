import { OpenAPIHono } from '@hono/zod-openapi'
import { notFound, onError } from 'stoker/middlewares'

import { configurePinoLogger } from './middlewares/pino-logger.js'

const app = new OpenAPIHono()
app.use(configurePinoLogger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Middlewares from stoker library
app.notFound(notFound)
app.onError(onError)

export default app
