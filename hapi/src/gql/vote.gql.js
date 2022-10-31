const { hasuraUtil } = require('../utils')

const add = async vote => {
  const mutation = `
    mutation ($vote: vote_insert_input!) {
      insert_vote_one(object: $vote, on_conflict: { constraint: vote_pkey, update_columns: [producers, weight] }) {
        account
      }
    }
  `
  const { insert_vote: data } = await hasuraUtil.instance.request(mutation, {
    vote
  })

  return data
}

const addMany = async voters => {
  const mutation = `
    mutation ($voters: [vote_insert_input]!) {
      insert_vote(objects: $voters, on_conflict: { constraint: vote_pkey, update_columns: [producers, weight] }) {
        affected_rows
      }
    }
  `
  const { insert_vote: data } = await hasuraUtil.instance.request(mutation, {
    voters
  })

  return data
}

const get = async (
  instance,
  { where = {}, limit = 100, offset = 0, orderBy = {} }
) => {
  const query = `
    query ($where: vote_bool_exp, $limit: Int, $offset: Int, $order_by: [vote_order_by!]) {
      vote(where: $where, limit: $limit, offset: $offset, order_by: $order_by) {
        account
        producers
        weight
        flag
      }
    }
  `
  const { vote } = await instance.request(query, {
    where,
    limit,
    offset,
    order_by: orderBy
  })

  return limit > 1 ? vote : vote[0]
}

module.exports = { add, addMany, get }
