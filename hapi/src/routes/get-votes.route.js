const Boom = require('@hapi/boom')
const Joi = require('joi')

const { voteService } = require('../services')

module.exports = {
  method: 'POST',
  path: '/get-votes',
  handler: async ({
    auth: {
      credentials: { token }
    },
    payload: {
      input: { filter }
    }
  }) => {
    try {
      return await voteService.get(token, filter)
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
              account: Joi.string().optional(),
              weight: Joi.string().optional(),
              flag: Joi.string().optional()
            }).optional()
          }).required()
        }).required()
      }).options({ stripUnknown: true })
    }
  }
}
