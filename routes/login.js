require("dotenv").config();

const Express = require("express");
const Router = Express.Router();
const axios = require("axios");

Router.get("/", (req, res) => {
    res.render("login/index", { req: req, error: false });
});

Router.get("/register", (req, res) => {
    res.render("register/index", { req: req, error: false });
});

Router.get("/created", (req, res) => {
    res.render("register/created", { req: req });
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
        })
        .catch((error) => {
            console.log(error.response.status)
            if (error.response.status == 401) {
                res.render("login/index", {
                    req: req,
                    error: "Błędne logowanie: Nazwa użytkownika albo hasło są nie prawidłowe",
                });
            } else if (error.response.status == 403) {
                res.render("login/index", {
                    req: req,
                    error: "Nie masz jeszcze dostępu do tego serwisu",
                });
            } 
            else {
                res.render("login/index", { req: req, error: "Nieznany błąd" });
            }
        });
});

Router.post("/register", async (req, res) => {
    await axios
        .post(`http://${process.env.HOST_IP}:5000/register`, req.body)
        .then((response) => {
            res.redirect("/login/created");
        })
        .catch((error) => {
            // console.log(error.response.status)
            if (error.response.status == 409) {
                res.render("register/index", {
                    req: req,
                    error: "Użytkownik o takim adresie już istnieje",
                });
            } else if (error.response.status == 403) {
                res.render("register/index", {
                    req: req,
                    error: "Hasła są niezgodne",
                });
            } else if (error.response.status == 500) {
                res.render("register/index", {
                    req: req,
                    error: "Błąd po stronie serwera. Skontaktuj się z administratorem",
                });
            } else {
                res.render("register/index", {
                    req: req,
                    error: "Nieznany błąd. Skontaktuj się z administratorem",
                });
            }
        });
});

module.exports = Router;
