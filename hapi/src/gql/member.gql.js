const { hasuraUtil } = require('../utils')

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

module.exports = {
  addMany
}
