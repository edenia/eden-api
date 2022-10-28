const { hasuraUtil } = require('../utils')

const updateByPk = async (id, payload) => {
  const mutation = `
    mutation ($id: uuid!, $payload: params_set_input!) {
      update_params_by_pk(pk_columns: {id: $id}, _set: $payload) {
        id
      }
    }
  `
  const { update_params_by_pk: updateParamsByPk } =
    await hasuraUtil.instance.request(mutation, {
      id,
      payload
    })

  return updateParamsByPk
}

const get = async (where, limit = 1) => {
  const query = `
    query ($where: params_bool_exp) {
      params(where: $where) {
        id
        next_account
        created_at
        updated_at
      }
    }
  `

  const { params } = await hasuraUtil.instance.request(query, {
    where
  })

  return limit > 1 ? params : params[0]
}

module.exports = { updateByPk, get }
