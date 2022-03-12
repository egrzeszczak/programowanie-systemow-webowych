require("dotenv").config();
const Express = require("express");
const Router = Express.Router();
const CookieParser = require("cookie-parser");
const Authenticate = require("../middleware/authenticate");
const Ticket = require("../models/Ticket");
const nodemailer = require("nodemailer");
const definition = require("../config/definition");
const Marked = require("marked");
const { JSDOM } = require("jsdom");
const DomPurifyModule = require("dompurify");

const DomPurify = DomPurifyModule(new JSDOM().window);

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
        user: process.env.MAIL_USER, // generated ethereal user
        pass: process.env.MAIL_PASS, // generated ethereal password
    },
});

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
            res.status(200).send(ticket);
        })
        .catch((error) => {
            console.log(error);
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

        // Push the message to ticket
        let ticket = await Ticket.findOneAndUpdate(
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
        );

        // Send notifications to each user involved excluding the user who has sent the message
        let senderExcluded = ticket.involved.filter(
            (email) => email != req.loggedIn.email
        );
        if (senderExcluded.length > 0) {
            senderExcluded.forEach(async (to) => {
                await messageAddedNotification(
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

        // OK
        res.status(200).send("OK");
    } catch (error) {
        res.status(404).send("error ziomeczku :/");
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
            await ticketClosedNotification(ticketToChange);
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

        await ticketCreatedNotification(req.loggedIn.email, NewTicket);

        res.redirect(`/ticket/id?id=${uniqueid}`);
    } catch (error) {
        res.sendStatus(409);
    }
});

// MAILER TEMPLATES

async function messageAddedNotification(from, to, message_parsed, ticket) {
    let notification = await transporter.sendMail({
        from: '"ServiceFront" <servicefront@ambas.com.pl>', // sender address
        to: to, // list of receivers
        subject: `Dodano komentarz do zgłoszenia '${ticket.id}'`, // Subject line
        text: "Hello world?", // plain text body
        html: `
            Dodano komentarz do zgłoszenia ${ticket.title}.</br>
            ---</br>
            ${from}:</br>
            ${message_parsed}
            ---</br>
            <a href="http://${process.env.HOST_IP}:3000/ticket/id?id=${ticket.id}">Link do zgłoszenia</a>
        `,
    });
    console.log("Message sent: %s", notification.messageId);
}
async function ticketCreatedNotification(to, ticket) {
    let notification = await transporter.sendMail({
        from: '"ServiceFront" <servicefront@ambas.com.pl>', // sender address
        to: to, // list of receivers
        subject: `Zgłoszenie '${ticket.id}' zostało utworzone`, // Subject line
        text: "Hello world?", // plain text body
        html: `
            Utworzono nowe zgłoszenie ${ticket.id} o tytule ${ticket.title}.
            ${ticket.description}
            <a href="http://${process.env.HOST_IP}:3000/ticket/id?id=${ticket.id}">Link do zgłoszenia</a>
        `,
    });
    console.log("Message sent: %s", notification.messageId);
}
async function ticketClosedNotification(ticket) {
    let notification = await transporter.sendMail({
        from: '"ServiceFront" <servicefront@ambas.com.pl>', // sender address
        to: ticket.issuedBy, // list of receivers
        subject: `Zgłoszenie '${ticket.id}' zostało zrealizowane`, // Subject line
        text: "Hello world?", // plain text body
        html: `
            Zgłoszenie ${ticket.id} o tytule ${ticket.title} zostało zrealizowane.
            <a href="http://${process.env.HOST_IP}:3000/ticket/id?id=${ticket.id}">Link do zgłoszenia</a>
        `,
    });
    console.log("Message sent: %s", notification.messageId);
}

module.exports = Router;
