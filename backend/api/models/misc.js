//.....Requirements.....//
const database = require("../../lib/db/database");

exports.getHotels = (req, res) => {
    database.query("SELECT * FROM hotels;", (err, result) => {
        if (err) {
            res.sendStatus(500);
            console.log(err);
        } else res.send(result);
    });
};

exports.getPaymentMethods = (req, res) => {
    database.query("SELECT * FROM payment_methods;", (err, result) => {
        if (err) {
            res.sendStatus(500);
            console.log(err);
        } else res.send(result);
    });
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect("/login");
};
