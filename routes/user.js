const Express = require('express')
const Router = Express.Router()
const User = require('../models/User')

Router.get('/:email', async (req, res) => {
 
    let UserRegexp = new RegExp(req.params.email, 'i')
    await User.find({ email: UserRegexp }, 'email access')
    .then((users) => {
        console.log(users)
        res.status(200).send(users)
    })
    .catch((error) => {
        console.log(error);
    });
})

module.exports = Router