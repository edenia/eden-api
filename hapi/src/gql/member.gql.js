const { hasuraUtil } = require('../utils')

const add = async payload => {
  const mutation = `
    mutation ($payload: member_insert_input!) {
      insert_member_one(object: $payload) {
        account
      }
    }
  `
  const data = await hasuraUtil.instance.request(mutation, { payload })

  return data.insert_member_one
}

const addMany = async members => {
  const mutation = `
    mutation ($members: [member_insert_input]!) {
      insert_member(objects: $members, on_conflict: { constraint: member_pkey, update_columns: [name, profile] }) {
        affected_rows
      }
    }
  `
  const { insert_member: data } = await hasuraUtil.instance.request(mutation, {
    members
  })

  return data
}

const get = async (where, getMany = false) => {
  const query = `
    query ($where: member_bool_exp) {
      member(where: $where) {
        id
        name
        bitgo_username
        enabled_currencies
        aml_policy
      }
    }
  `
  const { member } = await hasuraUtil.instance.request(query, {
    where
  })

  return getMany ? member : member[0]
}

module.exports = {
  add,
  addMany,
  get
}
