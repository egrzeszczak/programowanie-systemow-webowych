require("dotenv").config();
// Mail API
const nodemailer = require("nodemailer");

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

module.exports = {
    messageAdded: async function(from, to, message_parsed, ticket) {
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
    },
    ticketCreated: async function (to, ticket) {
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
    },
    ticketClosed: async function (ticket) {
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
}

