const Boom = require('@hapi/boom')
const Joi = require('joi')

const { accessService } = require('../services')

module.exports = {
  method: 'POST',
  path: '/revoke-access',
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
          access: Joi.object({
            account: Joi.string().required()
          }).required()
        }).required()
      }).options({ stripUnknown: true })
    }
  }
}
