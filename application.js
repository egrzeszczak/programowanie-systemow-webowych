// ENV
require("dotenv").config();

// Express Routing
const Express = require("express");

// Routers
const TicketRouter = require('./routes/ticket')
const LoginRouter = require('./routes/login')

// Parser cookisów
const CookieParser = require('cookie-parser')

// Middleware
const Authenticate = require('./middleware/authenticate')

// Init
const Application = Express();

// Setup
Application.use(Express.json());
Application.use(Express.urlencoded({ extended: false }));
Application.use(CookieParser())

// Router init
Application.use('/ticket', TicketRouter)
Application.use('/login', LoginRouter)

// Views
Application.set("view engine", "ejs");
Application.use('/public', Express.static('public'))

// '/' Route
Application.get("/", Authenticate, (req, res) => {
    res.render('index', {req: req})
});











// Run
const EXPOSE = 3000;
Application.listen(EXPOSE, () => {
    console.log(
        `APP [${new Date().toLocaleString("pl-PL", {
            timeZone: "UTC",
        })}] Application running at port ${EXPOSE}`
    );
});
