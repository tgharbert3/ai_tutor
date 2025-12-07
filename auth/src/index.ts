import app from './app.js'

const server = Bun.serve({
  port: 5500,
  fetch: app.fetch,
})

console.log(`Listening on ${server.url}`)
