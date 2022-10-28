const Boom = require('@hapi/boom')
const Joi = require('joi')

const { graphqlConstant } = require('../constants')
const { memberService } = require('../services')

module.exports = {
  method: 'POST',
  path: '/get-members',
  handler: async ({
    payload: {
      input: { filter }
    }
  }) => {
    try {
      return await memberService.get(filter)
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
              account: Joi.string()
                .valid(...Object.values(graphqlConstant.orderByOptions))
                .optional(),
              election_rank: Joi.string()
                .valid(...Object.values(graphqlConstant.orderByOptions))
                .optional()
            }).required()
          }).required()
        }).required()
      }).options({ stripUnknown: true })
    }
  }
}
