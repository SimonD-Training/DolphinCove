const database = require("../../../backend/lib/db/database");

const booking = (req, res) => {
    database.query("SELECT * FROM hotels;", (err, result) => {
        if (err) throw err;
        else
            database.query(
                "SELECT * FROM payment_methods;",
                (err2, result2) => {
                    if (err2) throw err2;
                    else
                        res.render("booking/booking", {
                            hotels: result,
                            payment_methods: result2,
                            loggedIn: req.session.loggedIn
                                ? "LOG OUT"
                                : "LOG IN",
                            url: req.session.loggedIn ? "/logout" : "/login",
                            dashurl: req.session.admin ? '/session/staff' : '/session/tour',
                        });
                }
            );
    });
};

module.exports = booking;
