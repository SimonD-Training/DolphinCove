//.....Requirements.....//
const express = require("express");
const body_parser = require("body-parser");
const { compare } = require("bcrypt");
const database = require("../lib/db/database");
const cookieParser = require("cookie-parser");
const session = require("express-session");

//.....Initializing Router.....//
let router = express.Router();
//.....Middlewares.....//
router.use(body_parser.json());
router.use(cookieParser());
router.use(
  session({
    secret: "o24ht0h4308gh0v0hw0hh4it2i0",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 120000 },
  })
);

//......Routes.....//

module.exports = router;