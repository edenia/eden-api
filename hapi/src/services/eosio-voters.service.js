const { eosioVotersGql } = require('../gql')

const get = async ({ limit = 100, offset, orderBy }) => {
  const eosioVoters = await eosioVotersGql.get({ limit, offset, orderBy })
  const more = await eosioVotersGql.get({
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
