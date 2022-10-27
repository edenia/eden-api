const healthzRoute = require('./healthz.route')
const addAccessRoute = require('./add-access.route')
const revokeAccessRoute = require('./revoke-access.route')
const updateAccessRoute = require('./update-access.route')
const getEosioVotersRoute = require('./get-eosio-voters.route')

module.exports = [
  healthzRoute,
  addAccessRoute,
  revokeAccessRoute,
  updateAccessRoute,
  getEosioVotersRoute
]
