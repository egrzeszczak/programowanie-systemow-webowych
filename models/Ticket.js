const Mongoose = require('mongoose')

const TicketSchema = new Mongoose.Schema({
    title: String,
    description: String,
    priority: String
})

module.exports = Mongoose.model('Ticket', TicketSchema)