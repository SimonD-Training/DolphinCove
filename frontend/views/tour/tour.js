const database = require("../../../backend/lib/db/database");

const tour = (req, res) => {
    database.query(
        "SELECT * FROM payments;",
        (err, result) => {
            if (err) throw err;
            else
                res.render("tour/tour", {
                    payments: result
                });
        }
    );
};

module.exports = tour;
