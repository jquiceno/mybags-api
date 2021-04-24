'use strict'

const { Router } = require('express')
const router = Router()

const { Person } = require('../lib/Person')

router.get('/', async (req, res, next) => {
  try {
    const persons = await Person.getAll()

    return res.json({
      data: persons,
      statusCode: 200
    })
  } catch (error) {
    return next(error)
  }
})

router.post('/', async ({ body }, res, next) => {
  try {
    const persons = await Person.add(body)

    return res.json({
      data: persons,
      statusCode: 201
    })
  } catch (error) {
    return next(error)
  }
})

router.get('/:personId', async ({ params }, res, next) => {
  try {
    const { personId } = params
    const person = new Person(personId)
    const personData = await person.get({
      required: true
    })

    return res.json({
      data: personData,
      statusCode: 200
    })
  } catch (error) {
    return next(error)
  }
})

router.delete('/:personId', async ({ params }, res, next) => {
  try {
    const { personId } = params
    const person = new Person(personId)
    const personData = await person.delete()

    return res.json({
      data: personData,
      statusCode: 200
    })
  } catch (error) {
    return next(error)
  }
})

router.put('/:personId', async ({ params, body }, res, next) => {
  try {
    const { personId } = params
    const person = new Person(personId)
    const personData = await person.update(body)

    return res.json({
      data: personData,
      statusCode: 200
    })
  } catch (error) {
    return next(error)
  }
})

module.exports = router
