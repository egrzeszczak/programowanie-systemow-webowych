const Express = require("express");
const Router = Express.Router();
const CookieParser = require("cookie-parser");
const Authenticate = require("../middleware/authenticate");

const Ticket = require("../models/Ticket");

Router.use(CookieParser());

Router.get("/", Authenticate, async (req, res) => {
    await Ticket.find({})
        .then((tickets) => {
            res.render("ticket/index", { req: req, tickets: tickets });
        })
        .catch((error) => {
            console.log(error);
        });
});

Router.get("/new", Authenticate, (req, res) => {
    res.render("ticket/new", { req: req });
});

Router.post("/new", Authenticate, (req, res) => {
    let NewTicket = new Ticket({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
    });

    try {
        NewTicket.save();
        res.redirect("/ticket");
    } catch (error) {
        res.sendStatus(409);
    }
});

module.exports = Router;
