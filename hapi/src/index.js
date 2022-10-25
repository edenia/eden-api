const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

const { serverConfig } = require('./config')
const routes = require('./routes')
const { workerService } = require('./services')
const { jwtUtil } = require('./utils')

const init = async () => {
  const server = Hapi.server({
    port: serverConfig.port,
    host: serverConfig.host,
    routes: {
      cors: { origin: ['*'] }
    },
    debug: { request: ['handler'] }
  })

  await server.register(Jwt)

  jwtUtil.auth(server)

  server.route(routes)
  await server.start()
  console.log(`🚀 Server ready at ${server.info.uri}`)
  server.table().forEach(route => console.log(`${route.method}\t${route.path}`))
  workerService.init()
}

process.on('uncaughtException', (err, origin) => {
  console.log('Uncaught Exception:', err, 'Exception origin:', origin)
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection:', promise, 'reason:', reason)
})

init()
