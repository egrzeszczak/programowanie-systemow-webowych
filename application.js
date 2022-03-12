// ENV
require("dotenv").config();

// Express Routing
const Express = require("express");
const Mongoose = require("mongoose");
const Cors = require("cors");

// Routers
const TicketRouter = require("./routes/ticket");
const LoginRouter = require("./routes/login");

// Parser cookisów
const CookieParser = require("cookie-parser");

// Middleware
const Authenticate = require("./middleware/authenticate");

// Init
const Application = Express();

// Setup
Application.use(Express.json());
Application.use(Express.urlencoded({ extended: false }));
Application.use(CookieParser());
Application.use(Cors());

Application.use(function (req, res, next) {
    // res.setHeader('Access-Control-Allow-Origin', `http://${process.env.HOST_IP}:3000`);
    res.setHeader("Access-Control-Allow-Origin", `*`);
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

// Router init
Application.use("/ticket", TicketRouter);
Application.use("/login", LoginRouter);

// Views
Application.set("view engine", "ejs");
Application.use("/public", Express.static("public"));










// '/' Route
Application.get("/", Authenticate, (req, res) => {
    res.render("index", { req: req });
});
// '/about' Route
Application.get("/about", Authenticate, (req, res) => {
    res.redirect('https://github.com/egrzeszczak/programowanie-systemow-webowych/blob/master/README.md');
});











// MongoDB Connect
Mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_ADDR}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).catch((error) => {
    console.log(`MongoDB Errors: ${error}`);
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
