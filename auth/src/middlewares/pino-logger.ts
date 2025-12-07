import { pinoLogger } from 'hono-pino'
import pino from 'pino'

export function configurePinoLogger() {
  // eslint-disable-next-line node/prefer-global/process
  if (process.env.ENVIRONMENT === 'development') {
    return pinoLogger({
      pino: pino({
        base: null,
        level: 'debug',

      }),
    })
  }

  else {
    return pinoLogger({
      pino: pino(),
    })
  }
}
