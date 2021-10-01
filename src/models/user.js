'use strict'

const { model, Schema } = require('mongoose')
const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')

const schema = new Schema({
  name: {
    required: true,
    type: String
  },
  lastName: String,
  bags: {
    type: Number,
    default: 0
  },
  country: String,
  city: String,
  email: {
    type: String,
    required: true,
    async validate (value) {
      const { error } = Joi.string().email().validate(this.email)

      if (error) {
        throw Boom.badRequest('The format of the email is incorrect')
      }

      const user = await this.model('Person').countDocuments({ email: value })

      if (user) throw Boom.conflict('User email already exist')

      return true
    }
  },
  phone: String
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v
      ret._id = ret._id.toString()
    }
  }
})

module.exports = model('Person', schema, 'persons')
