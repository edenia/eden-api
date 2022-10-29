const { apiConfig } = require('../config')
const { eosUtil, atomicassetsUtil, timeUtil } = require('../utils')
const { memberGql, voteGql, eosioVotersGql, paramsGql } = require('../gql')
const { paramsConstant } = require('../constants')

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
  const {
    rows,
    more,
    next_key: nextKey
  } = await getEdenMembers(startFrom, null, 50)

  for (const [i, member] of rows.entries()) {
    if (!member.status) {
      console.log('Cannot register INACTIVE member:', member)
      continue
    }

    console.log(`${i}. GETTING-DATA-FOR ${member.account}`)

    await paramsGql.updateByPk(paramsConstant.ID, {
      next_account: member.account
    })

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

    const promisesResult = await Promise.all([
      getVotes(
        smartProxyDefaultTableOptions,
        member.account,
        member.account,
        1
      ),
      getVotes(eosioDefaultTableOptions, member.account, member.account, 1)
    ])
    const profile = immutableData
      ? {
          name: immutableData.name,
          image: immutableData.img,
          bio: immutableData.bio,
          social: JSON.parse(immutableData.social)
        }
      : {}

    await memberGql.add({ ...member, profile })
    const vote = promisesResult[0].rows[0]

    if (promisesResult[0].rows.length) {
      await voteGql.add({ ...vote, flag: !!vote.flag })
    }

    if (promisesResult[1].rows.length) {
      const vote = promisesResult[1].rows[0]

      await eosioVotersGql.addMany({ ...vote, is_proxy: !!vote.is_proxy })
    }
  }

  return { more, nextKey }
}

const initUpdateMembers = async () => {
  const startFrom = await paramsGql.get({}, 1)
  let maxForceTries = 10
  let { more = true, nextKey = startFrom?.next_account } = {}

  while (more) {
    try {
      ;({ more, nextKey } = await updateMembers(nextKey))
      await paramsGql.updateByPk(paramsConstant.ID, { next_account: nextKey })
    } catch (err) {
      console.log(err)
      if (maxForceTries) {
        console.log('⏰ Sleeping to let the endpoints rest for 1.5 minutes...')
        await timeUtil.sleep(60 * 1.5)

        const helpStartFrom = await paramsGql.get({}, 1)

        nextKey = helpStartFrom?.next_account

        --maxForceTries
      } else {
        more = false
      }
    }
  }
}

const updateMembersWorker = () => {
  return {
    name: 'UPDATE EDEN MEMBERS',
    interval: 60 * 60, // 1h
    action: initUpdateMembers
  }
}

const get = async ({ limit = 100, offset, orderBy }) => {
  const eosioVoters = await memberGql.get({ limit, offset, orderBy })
  const more = await memberGql.get({
    limit: 1,
    offset: offset + limit,
    orderBy
  })

  return {
    rows: Array.isArray(eosioVoters) ? eosioVoters : [eosioVoters],
    more: !!more
  }
}

module.exports = {
  updateMembersWorker,
  get
}
