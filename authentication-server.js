require("dotenv").config();

const Express = require("express");
const JWT = require("jsonwebtoken");
const { Tedis } = require("tedis");
const Application = Express();

Application.use(Express.json());

// Logowanie / przydzielenie tokena autoryzującego
Application.post("/login", async (req, res) => {
    // Ułóż ładnie request
    const User = {
        username: req.body.username,
        password: req.body.password,
    };

    // Weryfikacja czy taki użytkownik istnieje w systemie
    const UserCheck = JSON.parse(await DATABASE.get(User.username));

	// Nie znaleziono takiego username
	if(!UserCheck) {
		res.sendStatus(404)
	}
    else if (
        User.username == UserCheck.username &&
        User.password == UserCheck.password
    ) {
        // Jeśli istnieje
        // Wygeneruj token JWT - pobierz przywilej i nazwę uzytkownika
        const AccessToken = JWT.sign(
            {
                username: UserCheck.username,
                access: UserCheck.access,
            },
            process.env.ACCESS_TOKEN_SECRET
        );
        // Zwróć token JWT
        res.status(200).json({ AccessToken: AccessToken });
    } else {
        // Źle podane hasło
        // Zwróć błąd 404
        res.sendStatus(404);
    }
});

Application.post("/register", async (req, res) => {
    // Ułóż ładnie request
    const UserCandidate = {
        username: req.body.username,
        password: req.body.password,
    };

    // Sprawdź czy czasem taki użytkownik nie istnieje
    const UserCheck = JSON.parse(await DATABASE.get(UserCandidate.username));
    if (UserCheck) {
        // Jeśli istnieje już taki użytkownik
        // Zwróć 409 Conflict
        res.sendStatus(409);
    } else {
        // Jeśli nie istnieje
        try {
            // Utwórz użytkownika
            await DATABASE.set(
                UserCandidate.username,
                JSON.stringify({
                    username: UserCandidate.username,
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

// function Verify(req, res, next) {
//     const AuthenticationHeader = req.headers["authorization"];
//     const Token = AuthenticationHeader && AuthenticationHeader.split(" ")[1];
//     if (Token == null) return res.sendStatus(401);

//     JWT.verify(Token, process.env.ACCESS_TOKEN_SECRET, (err, User) => {
//         if (err) return res.sendStatus(403);
//         req.User = User;
//         next();
//     });
// }


const DATABASE = new Tedis({ host: "localhost", port: 6379 });
const EXPOSE = 5000;
Application.listen(EXPOSE, () => {
    console.log(
        `AUTH [${new Date().toLocaleString("pl-PL", {
            timeZone: "UTC",
        })}] Authentication server running at port ${EXPOSE}`
    );
});
