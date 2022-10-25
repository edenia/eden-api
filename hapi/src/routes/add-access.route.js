const Boom = require('@hapi/boom')
const Joi = require('joi')

const { userConstant } = require('../constants')
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
    validate: {
      payload: Joi.object({
        input: Joi.object({
          access: Joi.object({
            account: Joi.string().required(),
            role: Joi.string().valid(userConstant.ROLES.client).required(),
            expirationTimeSec: Joi.number().required()
          }).required()
        }).required()
      }).options({ stripUnknown: true })
    }
  }
}
