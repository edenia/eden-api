const Jwt = require('@hapi/jwt')

const { jwtConfig } = require('../config')
const accessGql = require('../gql/access.gql')

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
  // TODO: use ttlSec by defuault expirationTime is not provided
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
          'x-hasura-default-role': role
        }
      } = artifacts.decoded.payload
      const token = artifacts.token

      const existingAccess = await accessGql.get(
        { access_token: { _eq: token } },
        1
      )

      return {
        isValid: !!existingAccess?.state,
        credentials: { user: { id, role }, token }
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
