// account
// role
// expiration-time

const Boom = require('@hapi/boom')
const Joi = require('joi')

const { accessService } = require('../services')

module.exports = {
  method: 'POST',
  path: '/add-access',
  handler: async ({
    payload: {
      input: { access }
    }
  }) => {
    try {
      return await accessService.add(access)
    } catch (error) {
      return Boom.badRequest(error.message)
    }
  },
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        input: Joi.object({
          access: Joi.object({
            account: Joi.string().required(),
            role: Joi.string().required(),
            expirationTime: Joi.string().required()
          }).required()
        }).required()
      }).options({ stripUnknown: true })
    }
  }
}
