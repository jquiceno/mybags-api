'use strict'

const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')

/**
 * [Basic Class]
 * @description The instans from this Class return all methods from Basic
 * Manage all Basic methos, this require Mongo Model pre defined and one Mongo connection success
 * @param {String} id - Basic mongo id, this field response with mongoId
 * @retun Basic Object intance
*/

class Basic {
  constructor ({ name, query = null, model = null } = {}) {
    if (model) {
      this.model = model
    }

    if (!this.model) throw Boom.badRequest('Model is require')

    this.query = query
    this.name = name
  }

  /**
   * @description [Add new Basic]
   * @param {Object} data - Object data with new Basic data
   */

  static async add (data = null) {
    try {
      if (Joi.object().required().empty({}).validate(data).error) {
        throw Boom.badRequest(`Data ${this.basic} is invalid`)
      }

      const basic = await this.model.create(data)

      return basic.toObject()
    } catch (error) {
      throw Boom.boomify(error)
    }
  }

  async get ({ required = false, object = true } = {}) {
    try {
      const basicData = await this.model.findOne(this.query)
      if (basicData) {
        this._id = basicData._id
      }

      if (required && !basicData) throw Boom.notFound(`${this.name} not found`)

      if (!basicData) return null

      if (object) return basicData.toObject()

      return basicData
    } catch (error) {
      throw Boom.boomify(error)
    }
  }

  /**
   * [Get all basics in db]
   * @param {Object} query - Query filter Object acepted for Mongoose find() method
   */

  static async count () {
    try {
      const count = await this.model.estimatedDocumentCount()
      return count
    } catch (error) {
      throw Boom.boomify(error)
    }
  }

  static async getAll ({ query = {}, params = {} } = {}) {
    try {
      // Validate query param type Object
      if (Joi.object().validate(query).error) throw Boom.badRequest('Parameter "query" must be an object')

      const req = this.model.find(query)

      req.sort('-created')
      req.limit(parseInt(params.limit) || 0).skip(parseInt(params.skip) || 0)

      const basics = await req.exec()
      return basics
    } catch (error) {
      throw Boom.boomify(error)
    }
  }

  async delete () {
    try {
      const basicData = await this.get({ required: true })
      await this.model.deleteOne({ _id: basicData._id })

      return basicData
    } catch (error) {
      throw Boom.boomify(error)
    }
  }

  /**
   * [Update an basic]
   * @param {Object} data - Object with new data for basic
   */

  async update (data = null, params = {}) {
    try {
      if (Joi.object().required().empty({}).validate(data).error) {
        throw Boom.badRequest(`Error, ${this.name} data not found or invalid`)
      }

      const storeData = await this.get()

      if (!storeData) {
        return this.model.create(data)
      }

      const result = await this.model.updateOne({ _id: storeData._id }, data, params)

      return { ...result, _id: storeData._id, id: storeData.id }
    } catch (error) {
      throw Boom.boomify(error)
    }
  }
}

module.exports = Basic
