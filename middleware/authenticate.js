// Authentication middleware
require("dotenv").config();

// Axios do fetchowania
const axios = require('axios')

// Moduł weryfikacji
module.exports = async function Authenticate(req, res, next) {
    if (!req.cookies.Authorization) {
        // Brak tokenu zalogowania, przekieruj do strony logowania
        res.redirect("/login");
    } else {
        // Token jest, weryfikuj
        await axios
            .post(`http://${process.env.HOST_IP}:5000/verify`, {
                Token:
                    req.cookies.Authorization &&
                    req.cookies.Authorization.split(" ")[1],
            })
            .then((response) => {
                req.loggedIn = response.data;
                next();
            })
            .catch((error) => {
                console.log(error);
                res.redirect("/login");
            });
    }
}
