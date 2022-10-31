const Boom = require('@hapi/boom')
const Joi = require('joi')

const { graphqlConstant } = require('../constants')
const { memberService } = require('../services')

module.exports = {
  method: 'POST',
  path: '/get-members',
  handler: async ({
    auth: {
      credentials: { token }
    },
    payload: {
      input: { filter }
    }
  }) => {
    try {
      return await memberService.get(token, filter)
    } catch (error) {
      return Boom.badRequest(error.message)
    }
  },
  options: {
    validate: {
      payload: Joi.object({
        input: Joi.object({
          filter: Joi.object({
            where: Joi.object().optional(),
            limit: Joi.number().required(),
            offset: Joi.number().required(),
            orderBy: Joi.object({
              account: Joi.string()
                .valid(...Object.values(graphqlConstant.orderByOptions))
                .optional(),
              election_rank: Joi.string()
                .valid(...Object.values(graphqlConstant.orderByOptions))
                .optional()
            }).optional()
          }).required()
        }).required()
      }).options({ stripUnknown: true })
    }
  }
}
