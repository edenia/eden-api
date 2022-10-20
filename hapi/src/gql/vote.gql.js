const { hasuraUtil } = require('../utils')

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

module.exports = { addMany }
