// pagination

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
      return {
        voters: await eosioVotersService.get(filter)
      }
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
              accessToken: Joi.string()
                .valid(graphqlConstant.orderByOptions)
                .optional(),
              account: Joi.string().optional(),
              role: Joi.string().optional(),
              state: Joi.string().optional()
            }).optional()
          }).required()
        }).required()
      }).options({ stripUnknown: true })
    }
  }
}
