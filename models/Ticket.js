const Mongoose = require('mongoose')

const Marked = require('marked')
const { JSDOM } = require('jsdom')
const DomPurifyModule = require('dompurify')
const DomPurify = DomPurifyModule(new JSDOM().window)

const TicketSchema = new Mongoose.Schema({
    id: String,
    title: String,
    description_md: String,
    description: String,
    description_ex: String,
    priority: String,
    category: String,
    status: String,
    createdOn: Date,
    issuedBy: String,
})

TicketSchema.pre('validate', function(next) {
    if(this.description_md) {
        this.description = Marked.parse(this.description_md)
        this.description = this.description.replace(/>\n/g, ">")
        this.description_ex = this.description.replace(/<\/?[^>]+(>|$)/g, " ")
        if(this.description_ex.length > 80) 
        {
            this.description_ex = this.description_ex.substring(0, 80) + "..."
        }
        this.description = DomPurify.sanitize(
            this.description
        );
    }
    next()
})

module.exports = Mongoose.model('Ticket', TicketSchema)