// Router
const Express = require("express");
const Router = Express.Router();
// Cookies
const CookieParser = require("cookie-parser");
// Auth middleware
const Authenticate = require("../middleware/authenticate");
// Ticket object for Mongoose
const Ticket = require("../models/Ticket");
const User = require("../models/User");

// Ticket definition
const definition = require("../config/definition");
// Markdown imports for messages
const Marked = require("marked");
const { JSDOM } = require("jsdom");
const DomPurifyModule = require("dompurify");
const DomPurify = DomPurifyModule(new JSDOM().window);

// Mailer plugin
const mailer = require("../plugins/nodemailer");

Router.use(CookieParser());

// VIEWS

// Wyświetlanie szczegółowe ticketa
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
            res.status(404).send(error);
        });
});

// Wyświetlanie tylko ticketów które stworzyłem OTWARTE i ZAMKNIĘTE
Router.get("/my", Authenticate, async (req, res) => {
    await Ticket.find({ issuedBy: req.loggedIn.email })
        .then((tickets) => {
            res.render("ticket/index", {
                title: "Moje zgłoszenia",
                req: req,
                tickets: tickets,
                definition: definition,
            });
        })
        .catch((error) => {
            res.status(404).send(error);
        });
});

// Wyświetlanie WSZYSTKICH ticketów otwartych
Router.get("/open", Authenticate, async (req, res) => {
    await Ticket.find({ status: ["new", "in-progress"] })
        .then((tickets) => {
            res.render("ticket/index", {
                title: "Wszystkie otwarte zgłoszenia",
                req: req,
                tickets: tickets,
                definition: definition,
            });
        })
        .catch((error) => {
            res.status(404).send(error);
        });
});

// Wyświetlanie WSZYSTKICH ticketów zamkniętych
Router.get("/closed", Authenticate, async (req, res) => {
    await Ticket.find({ status: "done" })
        .then((tickets) => {
            res.render("ticket/index", {
                title: "Wszystkie zamknięte zgłoszenia",
                req: req,
                tickets: tickets,
                definition: definition,
            });
        })
        .catch((error) => {
            res.status(404).send(error);
        });
});

// Wyświetlanie WSZYSTKICH ticketów otwartych w tablicy zgłoszeń
Router.get("/table", Authenticate, async (req, res) => {
    await User.find({ access: { $gte: 1 } }, "email access").then(
        async (specialists) => {
            await Ticket.find({ status: ["new", "in-progress"] })
                .then((tickets) => {
                    specialists.push({email: 'none'})
                    res.render("ticket/table", {
                        title: "Tablica zgłoszeń",
                        req: req,
                        tickets: tickets,
                        definition: definition,
                        specialists: specialists,
                    });
                })
                .catch((error) => {
                    res.status(404).send(error);
                });
        }
    );
});


// Formularz do nowego zgłoszenia
Router.get("/new", Authenticate, (req, res) => {
    res.render("ticket/new", { req: req, definition: definition });
});

// Do odświeżania informacji Vue.js
Router.post("/info", Authenticate, async (req, res) => {
    let ticket = await Ticket.findOne({ id: req.body.id })
        .then((ticket) => {
            res.status(200).send(ticket);
        })
        .catch((error) => {
            res.status(404).send(error);
        });
});

// Do odświeżania informacji Vue.js w tablicy
Router.post("/table", Authenticate, async (req, res) => {
    await Ticket.find({ status: ["new", "in-progress"] })
        .then((tickets) => {
            res.status(200).send(tickets) 
        })
        .catch((error) => {
            res.status(404).send(error);
        });
});

//  Wysyłanie wiadomości / zamieszczanie komentarza w zgłoszeniu
Router.post("/message", Authenticate, async (req, res) => {
    /*  
        Tutaj przychodzi
        { 
            id: req.body.id, 
            status: req.body.status 
        }
    */
    try {
        // Message markdown support
        let message_parsed = Marked.parse(req.body.message);
        message_parsed = message_parsed.replace(/>\n/g, ">");
        message_parsed = DomPurify.sanitize(message_parsed);

        // Zamieszczenie wiadomości do zgłoszenia
        await Ticket.findOneAndUpdate(
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
                        message: message_parsed,
                        message_md: req.body.message,
                    },
                },
                $addToSet: {
                    involved: req.loggedIn.email,
                },
            }
        )
            .then(async (ticket) => {
                // Wysłanie powiadomienia e-mail do wszystkich oprócz zgłaszającego
                let senderExcluded = ticket.involved.filter(
                    (email) => email != req.loggedIn.email
                );
                if (senderExcluded.length > 0) {
                    senderExcluded.forEach(async (to) => {
                        await mailer.messageAdded(
                            req.loggedIn.email,
                            to,
                            message_parsed,
                            ticket
                        );
                    });
                    // Add notification info to ticket
                    await Ticket.findOneAndUpdate(
                        { id: req.body.id },
                        {
                            $push: {
                                content: {
                                    type: "mail",
                                    date: new Date(),
                                    owner: senderExcluded.join(", "),
                                },
                            },
                        }
                    );
                }
                // Wszystko jest ok wyślij 200
                res.status(200).send("OK");
            })
            .catch((error) => {
                // Błąd przy wysyłaniu komentarza
                res.status(404).send(error);
            });
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

        if (req.body.status == "done") {
            await mailer.ticketClosed(ticketToChange);
        }

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
Router.post("/update/assign", Authenticate, async (req, res) => {
    //  { id: req.body.id, status: req.body.status }
    console.log(req.body);
    try {
        let ticketToChange = await Ticket.findOneAndUpdate(
            { id: req.body.id },
            {
                $set: {
                    assignedTo: req.body.assignedTo,
                    updatedOn: new Date(),
                },
                $push: {
                    content: {
                        type: "assign",
                        date: new Date(),
                        owner: req.loggedIn.email,
                        change: req.body.assignedTo,
                    },
                },
                $addToSet: {
                    involved: req.body.assignedTo,
                },
            }
        );

        await mailer.ticketAssigned(req.body.assignedTo, ticketToChange);

        await Ticket.findOneAndUpdate(
            { id: req.body.id },
            {
                $push: {
                    content: {
                        type: "mail",
                        date: new Date(),
                        owner: req.body.assignedTo,
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
            assignedTo: "none",
            involved: [req.loggedIn.email],
            content: [
                {
                    type: "created",
                    date: new Date(),
                    owner: req.loggedIn.email,
                },
                {
                    type: "mail",
                    date: new Date(),
                    owner: req.loggedIn.email,
                },
            ],
        });

        await NewTicket.save();

        await mailer.ticketCreated(req.loggedIn.email, NewTicket);

        res.redirect(`/ticket/id?id=${uniqueid}`);
    } catch (error) {
        res.sendStatus(409);
    }
});

module.exports = Router;
