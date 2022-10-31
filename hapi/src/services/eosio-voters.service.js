const { eosioVotersGql } = require('../gql')
const { hasuraUtil } = require('../utils')

const get = async (token, { where, limit = 100, offset, orderBy }) => {
  const instance = token
    ? hasuraUtil.buildClientInstance(token)
    : hasuraUtil.instance

  const eosioVoters = await eosioVotersGql.get(instance, {
    where,
    limit,
    offset,
    orderBy
  })
  const more = await eosioVotersGql.get(instance, {
    where,
    limit: 1,
    offset: offset + limit,
    orderBy
  })

  return {
    rows: Array.isArray(eosioVoters) ? eosioVoters : [eosioVoters],
    more: !!more
  }
}

module.exports = { get }
