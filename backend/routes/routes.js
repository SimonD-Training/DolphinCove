//.....Requirements.....//
const express = require("express");
const { compare } = require("bcrypt");
const database = require("../lib/db/database");

//.....Initializing Router.....//
let router = express.Router();

//......Page Routes.....//
router.get("/", (req, res) => {
});

module.exports = router;