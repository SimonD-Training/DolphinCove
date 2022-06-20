const database = require("../../../backend/lib/db/database");

const manage_bookings = (req, res) => {
    database.query("SELECT * FROM hotels;", (err, hotels) => {
        if (err) throw err;
        else
            database.query(
                "SELECT * FROM bookings NATURAL JOIN hotels NATURAL JOIN programs WHERE booking_id = ?;",
                [req.params.booking_id],
                (err, result) => {
                    if (err) throw err;
                    else {
                        if (result[0])
                            res.render("manage_bookings/manage_bookings", {
                                booking: result[0],
                                hotels: hotels,
                            });
                        else res.redirect("/session/staff");
                    }
                }
            );
    });
};

module.exports = manage_bookings;
