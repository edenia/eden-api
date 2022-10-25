const { jwtUtil } = require('../utils')
const { accessGql } = require('../gql')
const { accessConstant } = require('../constants')
const { jwtConfig } = require('../config')

const add = async ({ account, role, expirationTimeSec }) => {
  if (parseInt(jwtConfig.maxTtl) < expirationTimeSec) {
    throw new Error(`Expiration time exceeded the max of ${jwtConfig.maxTtl}`)
  }

  const existingAccess = await accessGql.get({ account: { _eq: account } }, 1)

  if (existingAccess?.state === accessConstant.STATE.inactive) {
    throw new Error('Account is banned')
  } else if (existingAccess) {
    throw new Error('Account have already an access token')
  }

  const res = await accessGql.add({
    account,
    role,
    access_token: jwtUtil.create(account, role, expirationTimeSec)
  })

  return { accessToken: res.access_token }
}

const revoke = async account => {
  const existingAccess = await accessGql.get({ account: { _eq: account } }, 1)

  if (!existingAccess) {
    throw new Error('Account does not exist')
  } else if (existingAccess.state === accessConstant.STATE.inactive) {
    throw new Error('Access is already revoked')
  }

  const res = await accessGql.updateByPk(account, {
    state: accessConstant.STATE.inactive
  })

  console.log('🚀 ~ revoke ~ res', res)

  return { result: true }
}

const update = async (account, expirationTimeSec) => {
  if (parseInt(jwtConfig.maxTtl) < expirationTimeSec) {
    throw new Error(`Expiration time exceeded the max of ${jwtConfig.maxTtl}`)
  }

  const existingAccess = await accessGql.get({ account: { _eq: account } }, 1)

  if (!existingAccess) {
    throw new Error('Account does not exist')
  } else if (existingAccess.state === accessConstant.STATE.inactive) {
    throw new Error('Account is banned')
  }

  const res = await accessGql.updateByPk(account, {
    state: accessConstant.STATE.active,
    access_token: jwtUtil.create(
      account,
      existingAccess.role,
      expirationTimeSec
    )
  })

  console.log('🚀 ~ update ~ res', res)

  return { accessToken: res.access_token }
}

module.exports = { add, revoke, update }
