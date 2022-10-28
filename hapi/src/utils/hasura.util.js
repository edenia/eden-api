const { GraphQLClient } = require('graphql-request')

const { hasuraConfig } = require('../config')
const axiosUtil = require('./axios.util')
const timeUtil = require('./time.util')

const hasuraAssembled = async () => {
  let hasuraReady = false

  while (!hasuraReady) {
    try {
      await axiosUtil.get(hasuraConfig.url.replace('/v1/graphql', '/healthz'))
      hasuraReady = true
    } catch (error) {
      hasuraReady = false
      console.log(
        'waiting for hasura...',
        hasuraConfig.url.replace('/v1/graphql', '/healthz')
      )
      await timeUtil.sleep(5)
    }
  }
}

const instance = new GraphQLClient(hasuraConfig.url, {
  headers: {
    'x-hasura-admin-secret': hasuraConfig.adminSecret
  }
})

module.exports = {
  hasuraAssembled,
  instance
}
