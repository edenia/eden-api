const Jwt = require('@hapi/jwt')

const { jwtConfig } = require('../config')

const generate = (ttlSec, { account, role }) => {
  return Jwt.token.generate(
    {
      sub: 'authorization',
      iss: jwtConfig.iss,
      'https://hasura.io/jwt/claims': {
        'x-hasura-user-id': account.toString(),
        'x-hasura-default-role': role,
        'x-hasura-allowed-roles': [role]
      }
    },
    {
      key: jwtConfig.secret,
      algorithm: jwtConfig.algo
    },
    { ttlSec, iat: Date.now() }
  )
}

const create = (account, role, expirationTime) => {
  const ttlSec = parseInt(expirationTime)

  return generate(ttlSec, { account, role })
}

const decode = token => Jwt.token.decode(token).decoded

const auth = server => {
  server.auth.strategy('jwt_strategy', 'jwt', {
    keys: jwtConfig.secret,
    verify: {
      aud: false,
      iss: jwtConfig.iss,
      sub: false,
      nbf: false,
      exp: true,
      maxAgeSec: parseInt(jwtConfig.maxTtl)
    },
    validate: async (artifacts, request, h) => {
      const {
        'https://hasura.io/jwt/claims': {
          'x-hasura-user-id': id,
          'x-hasura-user-email': email,
          'x-hasura-default-role': role,
          'x-hasura-customer-features': customerFeatures
        }
      } = artifacts.decoded.payload
      const token = artifacts.token

      return {
        isValid: true,
        credentials: { user: { id, email, role, customerFeatures }, token }
      }
    }
  })

  server.auth.default('jwt_strategy')
}

module.exports = {
  create,
  auth,
  decode
}
