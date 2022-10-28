const { hasuraUtil } = require('../utils')

const add = async member => {
  const mutation = `
    mutation ($member: member_insert_input!) {
      insert_member_one(object: $member, on_conflict: { constraint: member_pkey, update_columns: [name, profile] }) {
        account
      }
    }
  `
  const { insert_member: data } = await hasuraUtil.instance.request(mutation, {
    member
  })

  return data
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

module.exports = { add, addMany }
