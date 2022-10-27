// pagination

const Boom = require('@hapi/boom')
const Joi = require('joi')

const { accessService } = require('../services')

module.exports = {
  method: 'POST',
  path: '/get-member',
  handler: async ({
    payload: {
      input: { access }
    }
  }) => {
    try {
      return await accessService.revoke(access.account)
    } catch (error) {
      return Boom.badRequest(error.message)
    }
  },
  options: {
    validate: {
      payload: Joi.object({
        input: Joi.object({
          filter: Joi.object({
            limit: Joi.string().required(),
            offset: Joi.string().required(),
            orderBy: Joi.object({
              accessToken: Joi.string().optional(),
              account: Joi.string().optional(),
              role: Joi.string().optional(),
              state: Joi.string().optional()
            }).required()
          }).required()
        }).required()
      }).options({ stripUnknown: true })
    }
  }
}
