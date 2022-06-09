//.....Requirements.....//
const express = require("express");
const dotenv = require("dotenv");
const api = require("./api/hub");

//.....Initialize Dotenv.....//
dotenv.config();
//.....Instantiate and Configure App.....//
const app = express();
const port = process.env.PORT || 8000;
//.....Open Access to Application.....//
app.listen(port, () => console.log(`Listening on port: ${port}..`));

//.....Static Resources.....//
app.get("*.*", express.static("dist/dolphincove", {maxAge: "1y"})); //sets up the URIs for collecting the resources angular needs from the root of dist/project

//.....Api Routes.....//
app.post("/*", api);
app.get("/api/*", api);
app.put("/*", api);
app.delete("/*", api);

//.....Deliver Angular and Deliver Routes to Angular.....//
app.get("/*", (req, res) => {
    res.status(200).sendFile(`/`, {root: "dist/dolphincove"});
});