//.....Requirements.....//
const express = require("express");

//.....Initializing Router.....//
let router = express.Router();

//.....Middleware.....//
const sessionware = require("../middleware/sessionware");
const adminware = require("../middleware/adminware");

//.....Models.....//
const bookings = require("./models/bookings");
const { getHotels } = require("./models/misc");
const profiles = require("./models/profiles");
const programs = require("./models/programs");

//......API Routes.....//
//Create
router.post("/profile/tour_co", sessionware, adminware, profiles.createProfile );
router.post("/program", sessionware, adminware, programs.createProgram);
router.post("/booking", bookings.logBooking);
router.post("/session/booking", sessionware, adminware, bookings.createBooking);
router.post("/tour/booking", sessionware, bookings.createBooking);
router.post("/tourbook", sessionware, adminware, bookings.logTourBooking);
router.post("/tourbook/addvoucher", sessionware, bookings.createBookingVoucher);

//Read
router.post("/login", profiles.login);
router.get("/api/profiles", profiles.getProfiles);
router.get("/api/profile/:id", profiles.getProfile);
router.get("/api/programs", programs.getPrograms);
router.get("/api/bookings", sessionware, adminware, bookings.getBookings);
router.get("/api/payments", sessionware, adminware, bookings.getPayments);
router.get("/api/payments/:id", sessionware, bookings.getCompanyPayments);
router.get("/api/payment/:id", sessionware, bookings.getPaymentVouchers);
router.get("/api/hotels", getHotels);

//Update
router.put("/profile", sessionware, profiles.updateProfile);
router.put("/tour_co/:id", sessionware, adminware, profiles.updateTourCo);
router.put("/profile/email/:id", sessionware, profiles.updateLoginEmail);
router.put("/profile/password/:id", sessionware, profiles.updateLoginPass);
router.put("/program/:id", sessionware, adminware, programs.updateProgram);
router.put("/booking/:id", sessionware, adminware, bookings.updateBooking); 
router.put("/payments/:id", sessionware, bookings.updatePayment); 
router.put("/voucher/:id", sessionware, bookings.updateVoucher);

//Delete
router.delete("/profile/:id", sessionware, adminware, profiles.deleteProfile);
router.delete("/program/:id", sessionware, adminware, programs.deleteProgram);
router.delete("/booking/:id", sessionware, adminware, bookings.removeBooking);
router.delete("/pre-book/remvoucher/:id", sessionware, bookings.removeVoucher);
router.delete("/payment/cancel/:id", sessionware, bookings.cancelPayment);

module.exports = router;
