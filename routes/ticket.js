const Express = require("express");
const Router = Express.Router();
const CookieParser = require("cookie-parser");
const Authenticate = require("../middleware/authenticate");
const Ticket = require("../models/Ticket");

const definition = require("../config/definition")

Router.use(CookieParser());

Router.get("/id", Authenticate, async (req, res) => {
    await Ticket.findOne({ id: req.query.id })
        .then((ticket) => {
            console.log(ticket);
            res.render("ticket/id", { req: req, ticket: ticket, definition: definition });
        })
        .catch((error) => {
            console.log(error);
        });
});

Router.get("/", Authenticate, async (req, res) => {
    await Ticket.find({})
        .then((tickets) => {
            res.render("ticket/index", { req: req, tickets: tickets, definition: definition });
        })
        .catch((error) => {
            console.log(error);
        });
});

Router.get("/new", Authenticate, (req, res) => {
    res.render("ticket/new", { req: req, definition: definition });
});

Router.post("/new", Authenticate, async (req, res) => {
    try {
        let PREFIX = "T";
        let Tickets = await Ticket.find({});
        let uniqueid =
            PREFIX + (Tickets.length + 1).toString().padStart(5, "0");

        let NewTicket = new Ticket({
            id: uniqueid,
            title: req.body.title,
            description_md: req.body.description_md,
            priority: req.body.priority, 
            category: req.body.category, 
            status: "new",
            createdOn: new Date(),
            issuedBy: req.loggedIn.email,
        });

        await NewTicket.save();
        res.redirect(`/ticket/id?id=${uniqueid}`);
    } catch (error) {
        res.sendStatus(409);
    }
});

module.exports = Router;
