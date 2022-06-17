//.....Requirements.....//
const express = require("express");
const dotenv = require("dotenv");
const body_parser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const api = require("./api/hub");
const routes = require("./api/routes/routes");

//.....Initialize Dotenv.....//
dotenv.config();
//.....Instantiate and Configure App.....//
const app = express();
const port = process.env.PORT || 8000;
//.....Open Access to Application.....//
app.listen(port, () => console.log(`Listening on port: ${port}..`));

//.....Middlewares.....//
app.use(body_parser.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET || "fnhe7wmsd,pgr5ojf3g92873-9fbkasxgqw",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 120000 },
  })
);

//.....View Engine.....//
app.set("views", "frontend/views")
app.set("view engine", "ejs");

//.....Static Resources.....//
app.use(express.static("frontend/public"));

//.....Api Routes.....//
app.post("/*", api);
app.get("/api/*", api);
app.put("/*", api);
app.delete("/*", api);

//.....Address Routes.....//
app.get("*", routes);