const { jwtUtil } = require('../utils')
const { accessGql } = require('../gql')
const { accessConstant } = require('../constants')

const add = async ({ account, role, expirationTime }) => {
  const existingAccess = await accessGql.get({ account: { _eq: account } }, 1)

  if (
    existingAccess &&
    existingAccess.state === accessConstant.STATE.inactive
  ) {
    throw new Error('Account is banned')
  }

  const res = await accessGql.add({
    account,
    role,
    access_token: jwtUtil.create(account, role, expirationTime)
  })

  console.log('🚀 ~ add ~ res', res)
}

const revoke = async () => {}

module.exports = {
  add,
  revoke
}
