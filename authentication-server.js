// ENV
require("dotenv").config();

// Express
const Express = require("express");

// JWT
const JWT = require("jsonwebtoken");

// CookieParser
const CookieParser = require("cookie-parser");

// Auth DB
const { Tedis } = require("tedis");

// Init
const Application = Express();

// Setup
Application.use(Express.json());
Application.use(CookieParser());


Application.use(function (req, res, next) {

    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', `http://${process.env.HOST_IP}:3000`);
    res.setHeader('Access-Control-Allow-Origin', `*`);

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

// Logowanie / przydzielenie tokena autoryzującego
Application.post("/login", async (req, res) => {
    // Ułóż ładnie request
    const User = {
        email: req.body.email,
        password: req.body.password,
    };

    console.log(User)

    // Weryfikacja czy taki użytkownik istnieje w systemie
    const UserCheck = JSON.parse(await DATABASE.get(User.email));

    // Nie znaleziono takiego username
    if (!UserCheck) {
        res.sendStatus(404);
    } else if (
        User.email == UserCheck.email &&
        User.password == UserCheck.password
    ) {
        // Jeśli istnieje
        // Wygeneruj token JWT - pobierz przywilej i nazwę uzytkownika
        const AccessToken = JWT.sign(
            {
                email: UserCheck.email,
                access: UserCheck.access,
            },
            process.env.ACCESS_TOKEN_SECRET
        );
        // Zwróć token JWT
        res.status(200).json({
            AccessToken: AccessToken,
            User: UserCheck.email,
            Access: UserCheck.access,
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
    const Token = req.body.Token
    
    // Jeśli token pusty to znaczy że proszę sie zalogowac
    if (Token == null) return res.sendStatus(401);

    // JWT verify token
    JWT.verify(Token, process.env.ACCESS_TOKEN_SECRET, (err, User) => {
        if (err) {
            console.log(err)
            return res.status(403).send(err);
        } else {
            res.status(200).send(User);
        }
        // res.status(200).cookie('User', User.username).cookie('Access', User.access)
    });
});







Application.post("/register", async (req, res) => {
    // Ułóż ładnie request
    const UserCandidate = {
        email: req.body.email,
        password: req.body.password,
    };

    // Sprawdź czy czasem taki użytkownik nie istnieje
    const UserCheck = JSON.parse(await DATABASE.get(UserCandidate.email));
    if (UserCheck) {
        // Jeśli istnieje już taki użytkownik
        // Zwróć 409 Conflict
        res.sendStatus(409);
    } else {
        // Jeśli nie istnieje
        try {
            // Utwórz użytkownika
            await DATABASE.set(
                UserCandidate.email,
                JSON.stringify({
                    email: UserCandidate.email,
                    password: UserCandidate.password,
                    access: 0,
                })
            );

            // Zwróć 201 Created
            res.sendStatus(201);
        } catch (error) {
            res.sendStatus(500);
        }
    }
});




const DATABASE = new Tedis({ host: "localhost", port: 6379 });
const EXPOSE = 5000;
Application.listen(EXPOSE, () => {
    console.log(
        `AUTH [${new Date().toLocaleString("pl-PL", {
            timeZone: "UTC",
        })}] Authentication server running at port ${EXPOSE}`
    );
});
