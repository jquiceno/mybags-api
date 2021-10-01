'use strict'

const User = require('../lib/User')
const axios = require('axios')

async function users () {
  try {
    const [user] = await User.getAll()
    // if (user) return

    for (const key in Array(10).fill(0)) {
      const { data } = await axios.get('https://randomuser.me/api/')
      const [remoteUser] = data.results

      const userData = {
        name: remoteUser.name.first,
        lastName: remoteUser.name.last,
        bags: 0,
        country: remoteUser.location.country,
        city: remoteUser.location.city,
        email: remoteUser.email,
        phone: remoteUser.phone
      }

      await User.add(userData)
    }
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = async () => {
  await users()
}
