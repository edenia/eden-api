const { gql } = require('graphql-request')
const { hasuraUtil } = require('../utils')

const add = async member => {
  const mutation = gql`
    mutation ($member: member_insert_input!) {
      insert_member_one(
        object: $member
        on_conflict: {
          constraint: member_pkey
          update_columns: [name, profile]
        }
      ) {
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
  const mutation = gql`
    mutation ($members: [member_insert_input]!) {
      insert_member(
        objects: $members
        on_conflict: {
          constraint: member_pkey
          update_columns: [name, profile]
        }
      ) {
        affected_rows
      }
    }
  `
  const { insert_member: data } = await hasuraUtil.instance.request(mutation, {
    members
  })

  return data
}

const get = async (
  instance,
  { where = {}, limit = 100, offset = 0, orderBy = {} }
) => {
  const query = gql`
    query (
      $where: member_bool_exp
      $limit: Int
      $offset: Int
      $order_by: [member_order_by!]
    ) {
      member(
        where: $where
        limit: $limit
        offset: $offset
        order_by: $order_by
      ) {
        account
        name
        status
        nft_template_id
        election_participation_status
        election_rank
        representative
        encryption_key
        profile
        eosio_voters {
          producers
          proxy
        }
        vote {
          account
          producers
          weight
        }
      }
    }
  `
  const { member } = await instance.request(query, {
    where,
    limit,
    offset,
    order_by: orderBy
  })

  return limit > 1 ? member : member[0]
}

module.exports = { add, addMany, get }
