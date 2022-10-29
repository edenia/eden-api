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

const get = async ({ where = {}, limit = 100, offset = 0, orderBy = {} }) => {
  const query = `
    query ($where: eosio_voters_bool_exp, $limit: Int, $offset: Int, $order_by: [eosio_voters_order_by!]) {
      eosio_voters(where: $where, limit: $limit, offset: $offset, order_by: $order_by) {
        owner
        proxy
        producers
        staked
        last_vote_weight
        proxied_vote_weight
        is_proxy
        flags1
        reserved2
        reserved3
      }
    }
  `
  const { eosio_voters: eosioVoters } = await hasuraUtil.instance.request(
    query,
    {
      where,
      limit,
      offset,
      order_by: orderBy
    }
  )

  return limit > 1 ? eosioVoters : eosioVoters[0]
}

module.exports = { add, addMany, get }
