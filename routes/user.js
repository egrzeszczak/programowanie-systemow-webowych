const Express = require('express')
const Router = Express.Router()
const User = require('../models/User')

Router.get('/:email', async (req, res) => {
    let UserRegexp = new RegExp(req.params.email, 'i')
    await User.find({ email: UserRegexp }, 'email access')
    .then((users) => {
        res.status(200).send(users)
    })
    .catch((error) => {
        res.status(404).send(error)
    });
})

module.exports = Router