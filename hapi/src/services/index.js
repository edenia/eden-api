const workerService = require('./worker.service')
const accessService = require('./access.service')
const eosioVotersService = require('./eosio-voters.service')
const memberService = require('./member.service')
const voteService = require('./vote.service')

module.exports = {
  workerService,
  accessService,
  eosioVotersService,
  memberService,
  voteService
}
