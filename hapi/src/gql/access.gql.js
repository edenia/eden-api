const hasuraUtil = require('../utils/hasura.util')

const add = async payload => {
  const mutation = `
    mutation ($payload: access_insert_input!) {
      insert_access_one(object: $payload) {
        account
        access_token
      }
    }
  `
  const data = await hasuraUtil.instance.request(mutation, { payload })

  return data.insert_access_one
}

const updateByPk = async (account, payload) => {
  const mutation = `
    mutation ($account: String!, $payload: access_set_input!) {
      update_access_by_pk(pk_columns: {account: $account}, _set: $payload) {
        account
        access_token
      }
    }
  `
  const { update_access_by_pk: updateAccessByPk } =
    await hasuraUtil.instance.request(mutation, {
      account,
      payload
    })

  return updateAccessByPk
}

const get = async (where, limit = 1) => {
  const query = `
    query ($where: access_bool_exp, $limit: Int!) {
      access(where: $where, limit: $limit) {
        account
        role
        access_token
        state
      }
    }
  `

  const { access } = await hasuraUtil.instance.request(query, {
    where,
    limit
  })

  return limit > 1 ? access : access[0]
}

module.exports = { add, updateByPk, get }
