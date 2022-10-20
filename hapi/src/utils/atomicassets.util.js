const { ExplorerApi } = require('atomicassets')
const { apiConfig } = require('../config')

const api = new ExplorerApi(apiConfig.aaBaseUrl, 'atomicassets', {
  fetch: require('node-fetch')
})

module.exports = { api }
