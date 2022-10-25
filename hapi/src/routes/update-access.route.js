const Boom = require('@hapi/boom')
const Joi = require('joi')

const { accessService } = require('../services')

module.exports = {
  method: 'POST',
  path: '/update-access',
  handler: async ({
    payload: {
      input: { access }
    }
  }) => {
    try {
      return await accessService.update(access.account, access.expirationTime)
    } catch (error) {
      return Boom.badRequest(error.message)
    }
  },
  options: {
    validate: {
      payload: Joi.object({
        input: Joi.object({
          access: Joi.object({
            account: Joi.string().required(),
            expirationTimeSec: Joi.number().required()
          }).required()
        }).required()
      }).options({ stripUnknown: true })
    }
  }
}
