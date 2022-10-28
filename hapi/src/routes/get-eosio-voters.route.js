const Boom = require('@hapi/boom')
const Joi = require('joi')

const { graphqlConstant } = require('../constants')
const { eosioVotersService } = require('../services')

module.exports = {
  method: 'POST',
  path: '/get-eosio-voters',
  handler: async ({
    payload: {
      input: { filter }
    }
  }) => {
    try {
      return await eosioVotersService.get(filter)
    } catch (error) {
      return Boom.badRequest(error.message)
    }
  },
  options: {
    validate: {
      payload: Joi.object({
        input: Joi.object({
          filter: Joi.object({
            limit: Joi.number().required(),
            offset: Joi.number().required(),
            orderBy: Joi.object({
              owner: Joi.string()
                .valid(...Object.values(graphqlConstant.orderByOptions))
                .optional(),
              proxy: Joi.string()
                .valid(...Object.values(graphqlConstant.orderByOptions))
                .optional(),
              staked: Joi.string()
                .valid(...Object.values(graphqlConstant.orderByOptions))
                .optional(),
              last_vote_weight: Joi.string()
                .valid(...Object.values(graphqlConstant.orderByOptions))
                .optional(),
              proxied_vote_weight: Joi.string()
                .valid(...Object.values(graphqlConstant.orderByOptions))
                .optional()
            }).optional()
          }).required()
        }).required()
      }).options({ stripUnknown: true })
    }
  }
}