// ENV
require("dotenv").config();

// Express Routing
const Express = require("express");
const Mongoose = require("mongoose");
const Cors = require('cors');

// Routers
const TicketRouter = require('./routes/ticket')
const LoginRouter = require('./routes/login')

// Parser cookisów
const CookieParser = require('cookie-parser')

// Middleware
const Authenticate = require('./middleware/authenticate');


// Init
const Application = Express();

// Setup
Application.use(Express.json());
Application.use(Express.urlencoded({ extended: false }));
Application.use(CookieParser())
Application.use(Cors());

Application.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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

// MongoDB Config
const { MONGODB } = require("./config/database");
// MongoDB Connect
Mongoose.connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).catch(error => {
    console.log(`MongoDB Errors: ${error}`)
});


// Runtime
const EXPOSE = 3000;
Application.listen(EXPOSE, () => {
    console.log(
        `APP [${new Date().toLocaleString("pl-PL", {
            timeZone: "UTC",
        })}] Application running at port ${EXPOSE}`
    );
});
