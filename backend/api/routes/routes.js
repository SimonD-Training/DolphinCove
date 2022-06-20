//.....Requirements.....//
const express = require("express");
const { logout } = require("../models/misc");

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
const booking = require("../../../frontend/views/booking/booking");
router.get("/booking", booking);
const programs = require("../../../frontend/views/programs/programs");
router.get("/programs", programs);
const companies = require("../../../frontend/views/companies/companies");
router.get("/companies", companies);
const contact = require("../../../frontend/views/contact/contact");
router.get("/contact", contact);
router.get("/logout", logout);

router.get("*", sessionware);
router.get("/session/admin/*", companyware);
const manage_vouchers = require("../../../frontend/views/manage_vouchers/manage_vouchers");
router.get("/session/tour/manage_vouchers/:payment_id", manage_vouchers);
const manage_profile = require("../../../frontend/views/manage_profile/manage_profile");
router.get("/session/tour/manage_profile", manage_profile);
const tour = require("../../../frontend/views/tour/tour");
router.get("/session/tour", tour);

router.get("/session/staff/*", adminware);
const manage_tour_co = require("../../../frontend/views/manage_tour_co/manage_tour_co");
router.get("/session/staff/manage_tour_co/:tour_co_id", manage_tour_co);
const manage_bookings = require("../../../frontend/views/manage_bookings/manage_bookings");
router.get("/session/staff/manage_booking/:booking_id", manage_bookings);
const staff = require("../../../frontend/views/staff/staff");
router.get("/session/staff", staff);


module.exports = router;