const { apiConfig } = require('../config')
const { eosUtil, atomicassetsUtil } = require('../utils')
const { memberGql, voteGql } = require('../gql')

const edenDefaultTableOptions = {
  code: apiConfig.edenContract,
  scope: 0
}

const smartProxyDefaultTableOptions = {
  code: apiConfig.edensmartprxContract,
  scope: apiConfig.edensmartprxContract
}

const getEdenMembers = async (lowerBound, upperBound, limit = 100) => {
  const { rows, ...rest } = await eosUtil.getTableRows({
    ...edenDefaultTableOptions,
    table: 'member',
    lower_bound: lowerBound,
    upper_bound: upperBound,
    limit
  })

  return {
    rows: rows?.[0]?.length ? rows.map(row => row[1]) : rows,
    ...rest
  }
}

const getVotes = async (lowerBound, upperBound, limit = 100) => {
  const { rows, ...rest } = await eosUtil.getTableRows({
    ...smartProxyDefaultTableOptions,
    table: 'votes',
    lower_bound: lowerBound,
    upper_bound: upperBound,
    limit
  })

  return {
    rows: rows || [],
    ...rest
  }
}

const updateMembers = async startFrom => {
  const membersData = []
  const votesData = []
  const { rows, more, next_key: nextKey } = await getEdenMembers(startFrom)

  for (const member of rows) {
    const { immutable_data: immutableData } =
      await atomicassetsUtil.api.getTemplate(
        apiConfig.edenContract,
        member.nft_template_id.toString()
      )
    const profile = immutableData
      ? {
          name: immutableData.name,
          image: immutableData.img,
          bio: immutableData.bio,
          social: JSON.parse(immutableData.social)
        }
      : {}
    const votes = await getVotes(member.account, member.account, 1)

    membersData.push({ ...member, profile })

    if (votes.rows.length) {
      const vote = votes.rows[0]

      votesData.push({
        account: vote.account,
        producers: vote.producers,
        weight: vote.weight
      })
    }
  }

  if (more) {
    updateMembers(nextKey)
  }

  await memberGql.addMany(membersData)
  await voteGql.addMany(votesData)
}

const updateMembersWorker = () => {
  return {
    name: 'UPDATE EDEN MEMBERS',
    // interval: affiliateConfig.verifyExpiredInterval,
    interval: 60 * 60, // 1h
    action: updateMembers
  }
}

module.exports = {
  updateMembersWorker
}
