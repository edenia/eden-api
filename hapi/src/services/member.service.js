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
  const {
    rows,
    more,
    next_key: nextKey
  } = await getEdenMembers(startFrom, null, 30)

  for (const [i, member] of rows.entries()) {
    if (!member.status) {
      console.log('Cannot register INACTIVE member:', member)
      continue
    }

    console.log(`${i}. GETTING-DATA-FOR ${member.account}`)

    let immutableData = null
    try {
      ;({ immutable_data: immutableData } =
        await atomicassetsUtil.api.getTemplate(
          apiConfig.edenContract,
          member.nft_template_id.toString()
        ))
    } catch (err) {
      console.log('Error getting template id', member.nft_template_id)
      console.log('Error getting profile', member.account)
    }

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

  await memberGql.addMany(membersData)
  await voteGql.addMany(votesData)

  if (more) {
    await updateMembers(nextKey)
  }
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
