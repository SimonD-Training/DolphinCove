const database = require("../../../backend/lib/db/database");

const staff = (req, res) => {
    database.query(
        "SELECT * FROM tour_companies NATURAL JOIN login;",
        (err, result) => {
            if (err) throw err;
            else {
                database.query(
                    "SELECT * FROM bookings NATURAL JOIN clients NATURAL JOIN hotels NATURAL JOIN payments NATURAL JOIN programs ORDER BY date DESC;",
                    (err, result2) => {
                        if (err) throw err;
                        else
                            res.render("staff/staff", {
                                tour_companies: result,
                                bookings: result2,
                            });
                    }
                );
            }
        }
    );
};

module.exports = staff;
