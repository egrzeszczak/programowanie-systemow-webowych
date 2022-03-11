require("dotenv").config();

const Express = require("express");
const Router = Express.Router();
const axios = require("axios");

Router.get("/", (req, res) => {
    res.render("login/index", { req: req });
});

Router.get("/register", (req, res) => {
    res.render("register/index", { req: req });
});

Router.get("/logout", (req, res) => {
    res.clearCookie("Authorization")
        .clearCookie("User")
        .clearCookie("Access")
        .redirect("/");
});

Router.post("/", async (req, res) => {
    await axios
        .post(`http://${process.env.HOST_IP}:5000/login`, req.body)
        .then((response) => {
            res.cookie("Authorization", "Bearer " + response.data.AccessToken)
                .cookie("User", response.data.User)
                .cookie("Access", response.data.Access)
                .redirect("/");
        });
});

Router.post("/register", async (req, res) => {
    await axios
        .post(`http://${process.env.HOST_IP}:5000/register`, req.body)
        .then((response) => {
            res.redirect('/')
        });
});

module.exports = Router;
