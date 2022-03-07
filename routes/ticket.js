const Express = require("express");
const Router = Express.Router();
const CookieParser = require("cookie-parser");
const axios = require("axios");
const Authenticate = require('../middleware/authenticate')
Router.use(CookieParser());

Router.get("/", Authenticate, (req, res) => {
    res.render("ticket/index", {req: req});
});

Router.get("/new", Authenticate, (req, res) => {
    res.render("ticket/new", {req: req});
});

Router.post("/new", Authenticate, (req, res) => {
    console.log(req.headers);
    res.sendStatus(201);
});



module.exports = Router;
