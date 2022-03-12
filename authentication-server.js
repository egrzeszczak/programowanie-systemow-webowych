// ENV
require("dotenv").config();

const Express = require("express");
const Application = Express();
const CookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");
const Mongoose = require("mongoose");
const User = require("./models/User");

// Setup
Application.use(Express.json());
Application.use(CookieParser());
Application.use(function (req, res, next) {
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

// Logowanie / przydzielenie tokena autoryzującego
Application.post("/login", async (req, res) => {
    // Ułóż ładnie request
    const Attempt = {
        email: req.body.email,
        password: req.body.password,
    };

    // Weryfikacja czy taki użytkownik istnieje w systemie
    const UserCheck = await User.find({
        email: Attempt.email,
        password: Attempt.password,
    });

    // Nie znaleziono takiego username
    if (UserCheck.length == 0) {
        res.sendStatus(404);
    } else if (
        Attempt.email == UserCheck[0].email &&
        Attempt.password == UserCheck[0].password
    ) {
        // Jeśli istnieje
        // Wygeneruj token JWT - pobierz przywilej i nazwę uzytkownika
        const AccessToken = JWT.sign(
            {
                email: UserCheck[0].email,
                access: UserCheck[0].access,
            },
            process.env.ACCESS_TOKEN_SECRET
        );
        // Zwróć token JWT
        res.status(200).json({
            AccessToken: AccessToken,
            User: UserCheck[0].email,
            Access: UserCheck[0].access,
        });
    } else {
        // Źle podane hasło
        // Zwróć błąd 404
        res.sendStatus(404);
    }
});

// Weryfikacja tokenu
Application.post("/verify", async (req, res) => {
    // Gotowy token już bez 'Bearer '
    const Token = req.body.Token;

    // Jeśli token pusty to znaczy że proszę sie zalogowac
    if (Token == null) return res.sendStatus(401);

    // JWT verify token
    JWT.verify(Token, process.env.ACCESS_TOKEN_SECRET, (err, User) => {
        if (err) {
            console.log(err);
            return res.status(403).send(err);
        } else {
            res.status(200).send(User);
        }
    });
});

Application.post("/register", async (req, res) => {
    // Ułóż ładnie request
    const UserCandidate = {
        email: req.body.email,
        password: req.body.password,
    };

    // Sprawdź czy czasem taki użytkownik nie istnieje
    let UserCheck = await User.find({
        email: UserCandidate.email,
        password: UserCandidate.password,
    });

    if (UserCheck.length > 0) {
        // Jeśli istnieje już taki użytkownik
        // Zwróć 409 Conflict
        res.sendStatus(409);
    } else {
        // Jeśli nie istnieje
        try {
            // Utwórz użytkownika
            let NewUser = new User({
                email: UserCandidate.email,
                password: UserCandidate.password,
                access: 0,
            });

            await NewUser.save();

            // Zwróć 201 Created
            res.sendStatus(201);
        } catch (error) {
            res.sendStatus(500);
        }
    }
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

const EXPOSE = 5000;
Application.listen(EXPOSE, () => {
    console.log(
        `AUTH [${new Date().toLocaleString("pl-PL", {
            timeZone: "UTC",
        })}] Authentication server running at port ${EXPOSE}`
    );
});
