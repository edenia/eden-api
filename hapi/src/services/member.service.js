const { apiConfig } = require('../config')
const { eosUtil, atomicassetsUtil } = require('../utils')
const { memberGql, voteGql, eosioVotersGql } = require('../gql')

const edenDefaultTableOptions = {
  code: apiConfig.edenContract,
  scope: 0
}

const smartProxyDefaultTableOptions = {
  code: apiConfig.edensmartprxContract,
  scope: apiConfig.edensmartprxContract,
  table: 'votes'
}

const eosioDefaultTableOptions = {
  code: 'eosio',
  scope: 'eosio',
  table: 'voters'
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

const getVotes = async (options, lowerBound, upperBound, limit = 100) => {
  const { rows, ...rest } = await eosUtil.getTableRows({
    ...options,
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
  const smartProxyVotesData = []
  const eosioVotersData = []
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
    const smartProxyVotes = await getVotes(
      smartProxyDefaultTableOptions,
      member.account,
      member.account,
      1
    )

    membersData.push({ ...member, profile })
    const vote = smartProxyVotes.rows[0]

    if (smartProxyVotes.rows.length) {
      smartProxyVotesData.push({ ...vote, flag: !!vote.flag })
    }

    const eosioVoters = await getVotes(
      eosioDefaultTableOptions,
      member.account,
      member.account,
      1
    )

    if (eosioVoters.rows.length) {
      const vote = eosioVoters.rows[0]

      eosioVotersData.push({ ...vote, is_proxy: !!vote.is_proxy })
    }
  }

  await memberGql.addMany(membersData)
  await voteGql.addMany(smartProxyVotesData)
  await eosioVotersGql.addMany(eosioVotersData)

  if (more) {
    await updateMembers(nextKey)
  }
}

const updateMembersWorker = () => {
  return {
    name: 'UPDATE EDEN MEMBERS',
    interval: 60 * 60, // 1h
    action: updateMembers
  }
}

module.exports = {
  updateMembersWorker
}
