'use strict'

const { Router } = require('express')
const router = Router()

const User = require('../lib/User')

router.get('/', async (req, res, next) => {
  try {
    const users = await User.getAll()

    return res.json({
      data: users,
      statusCode: 200
    })
  } catch (error) {
    return next(error)
  }
})

router.post('/', async ({ body }, res, next) => {
  try {
    const users = await User.add(body)

    return res.json({
      data: users,
      statusCode: 201
    })
  } catch (error) {
    return next(error)
  }
})

router.get('/:userId', async ({ params }, res, next) => {
  try {
    const { userId } = params
    const user = new User(userId)
    const userData = await user.get({
      required: true
    })

    return res.json({
      data: userData,
      statusCode: 200
    })
  } catch (error) {
    return next(error)
  }
})

router.delete('/:userId', async ({ params }, res, next) => {
  try {
    const { userId } = params
    const user = new User(userId)
    const userData = await user.delete()

    return res.json({
      data: userData,
      statusCode: 200
    })
  } catch (error) {
    return next(error)
  }
})

module.exports = router
