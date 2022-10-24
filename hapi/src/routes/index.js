const healthzRoute = require('./healthz.route')
const addAccessRoute = require('./add-access.route')
const revokeAccessRoute = require('./revoke-access.route')

module.exports = [healthzRoute, addAccessRoute, revokeAccessRoute]
