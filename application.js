require("dotenv").config();

const Express = require("express");

const Application = Express();

const EXPOSE = 3000;
Application.listen(EXPOSE, () => {
    console.log(
        `APP [${new Date().toLocaleString("pl-PL", {
            timeZone: "UTC",
        })}] Application running at port ${EXPOSE}`
    );
});