'use strict'

const { Types } = require('mongoose')
const Basic = require('../Basic')
const Model = require('../../models/user')
const { badRequest } = require('@hapi/boom')

class User extends Basic {
  constructor (id) {
    const _id = /^[0-9a-fA-F]{24}$/.test(id) ? Types.ObjectId(id) : null

    const $or = []

    if (_id) $or.push({ _id: id })

    if (!$or.length) throw badRequest('Invalid user Id')

    super({
      name: 'User',
      query: {
        $or
      },
      model: Model
    })

    this._id = _id
  }
}

User.model = Model

module.exports = User
