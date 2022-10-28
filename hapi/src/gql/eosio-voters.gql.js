const { hasuraUtil } = require('../utils')

const add = async eosioVoter => {
  const mutation = `
    mutation ($eosio_voter: eosio_voters_insert_input!) {
      insert_eosio_voters_one(object: $eosio_voter, on_conflict: { constraint: eosio_voters_pkey, update_columns: [producers, weight] }) {
        owner
      }
    }
  `
  const { insert_eosio_voters: data } = await hasuraUtil.instance.request(
    mutation,
    {
      eosio_voters: eosioVoter
    }
  )

  return data
}

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

module.exports = { add, addMany }
