//.....Requirements.....//
const express = require("express");

//.....Initializing Router.....//
let router = express.Router();

//.....Middleware.....//
const sessionware = require("../../middleware/sessionware");
const adminware = require("../../middleware/adminware");
const companyware = require("../../middleware/companyware");

//......Page Routes.....//
const index = require("../../../frontend/views/index/index");
router.get("/", index);
const login = require("../../../frontend/views/login/login");
router.get("/login", login);
const programs = require("../../../frontend/views/programs/programs");
router.get("/programs", programs);
const contact = require("../../../frontend/views/contact/contact");
router.get("/contact", contact);

// router.get("*", sessionware);
// router.get("*", companyware);
const staff = require("../../../frontend/views/staff/staff");
router.get("/session/staff", staff);
const tour = require("../../../frontend/views/tour/tour");
router.get("/session/tour", tour);

router.get("*", adminware);


module.exports = router;