const Express = require("express");
const Router = Express.Router();
const CookieParser = require("cookie-parser");
const Authenticate = require("../middleware/authenticate");
const Ticket = require("../models/Ticket");

const definition = require("../config/definition");

Router.use(CookieParser());

// VIEW
Router.get("/id", Authenticate, async (req, res) => {
    await Ticket.findOne({ id: req.query.id })
        .then((ticket) => {
            res.render("ticket/id", {
                req: req,
                ticket: ticket,
                definition: definition,
            });
        })
        .catch((error) => {
            console.log(error);
        });
});
Router.get("/open", Authenticate, async (req, res) => {
    await Ticket.find({ status: ["new", "in-progress"] })
        .then((tickets) => {
            res.render("ticket/index", {
                req: req,
                tickets: tickets,
                definition: definition,
            });
        })
        .catch((error) => {
            console.log(error);
        });
});
Router.get("/closed", Authenticate, async (req, res) => {
    await Ticket.find({ status: "done" })
        .then((tickets) => {
            res.render("ticket/index", {
                req: req,
                tickets: tickets,
                definition: definition,
            });
        })
        .catch((error) => {
            console.log(error);
        });
});
Router.get("/new", Authenticate, (req, res) => {
    res.render("ticket/new", { req: req, definition: definition });
});

// API
Router.post("/info", Authenticate, async (req, res) => {
    let ticket = await Ticket.findOne({ id: req.body.id })
        .then((ticket) => {
            res.status(200).send(ticket) 
        })
        .catch((error) => {
            console.log(error);
        });
});


Router.post("/message", Authenticate, async (req, res) => {
    //  { id: req.body.id, status: req.body.status }
    console.log(req.body);
    try {
        let ticketToChange = await Ticket.findOneAndUpdate(
            { id: req.body.id },
            {
                $set: {
                    updatedOn: new Date(),
                },
                $push: {
                    content: {
                        type: "message",
                        date: new Date(),
                        owner: req.loggedIn.email,
                        message: req.body.message,
                    },
                },
            }
        );
        res.status(200).send("OK");
    } catch (error) {
        res.status(404).send(error);
    }
});
Router.post("/update/status", Authenticate, async (req, res) => {
    //  { id: req.body.id, status: req.body.status }
    console.log(req.body);
    try {
        let ticketToChange = await Ticket.findOneAndUpdate(
            { id: req.body.id },
            {
                $set: {
                    status: req.body.status,
                    updatedOn: new Date(),
                },
                $push: {
                    content: {
                        type: "status",
                        date: new Date(),
                        owner: req.loggedIn.email,
                        change: req.body.status,
                    },
                },
            }
        );
        res.status(200).send("OK");
    } catch (error) {
        res.status(404).send(error);
    }
});
Router.post("/update/priority", Authenticate, async (req, res) => {
    //  { id: req.body.id, status: req.body.status }
    console.log(req.body);
    try {
        let ticketToChange = await Ticket.findOneAndUpdate(
            { id: req.body.id },
            {
                $set: {
                    priority: req.body.priority,
                    updatedOn: new Date(),
                },
                $push: {
                    content: {
                        type: "priority",
                        date: new Date(),
                        owner: req.loggedIn.email,
                        change: req.body.priority,
                    },
                },
            }
        );
        res.status(200).send("OK");
    } catch (error) {
        res.status(404).send(error);
    }
});
Router.post("/update/category", Authenticate, async (req, res) => {
    //  { id: req.body.id, status: req.body.status }
    console.log(req.body);
    try {
        let ticketToChange = await Ticket.findOneAndUpdate(
            { id: req.body.id },
            {
                $set: {
                    category: req.body.category,
                    updatedOn: new Date(),
                },
                $push: {
                    content: {
                        type: "category",
                        date: new Date(),
                        owner: req.loggedIn.email,
                        change: req.body.category,
                    },
                },
            }
        );
        res.status(200).send("OK");
    } catch (error) {
        res.status(404).send(error);
    }
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
            updatedOn: new Date(),
            issuedBy: req.loggedIn.email,
            content: [
                {
                    type: "created",
                    date: new Date(),
                    owner: req.loggedIn.email,
                },
            ],
        });

        await NewTicket.save();
        res.redirect(`/ticket/id?id=${uniqueid}`);
    } catch (error) {
        res.sendStatus(409);
    }
});

module.exports = Router;
