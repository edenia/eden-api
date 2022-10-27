const { eosioVotersGql } = require('../gql')

const get = async ({ limit, offset, orderBy }) => {
  return await eosioVotersGql.get({ limit, offset, orderBy })
}

module.exports = { get }
