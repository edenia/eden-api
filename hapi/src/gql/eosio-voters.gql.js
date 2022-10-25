const { hasuraUtil } = require('../utils')

const addMany = async voters => {
  const mutation = `
    mutation ($voters: [eosio_voters_insert_input]!) {
      insert_eosio_voters(objects: $voters, on_conflict: { constraint: eosio_voters_pkey, update_columns: [proxy, producers] }) {
        affected_rows
      }
    }
  `
  const { insert_member: data } = await hasuraUtil.instance.request(mutation, {
    voters
  })

  return data
}

module.exports = { addMany }
