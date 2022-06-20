const database = require("../../../backend/lib/db/database");

const tour = (req, res) => {
    database.query(
        "SELECT * FROM payments WHERE tour_co_id = ?;",
        [req.session.profile],
        (err, result) => {
            if (err) throw err;
            else
                database.query(
                    "SELECT * FROM tour_companies WHERE tour_co_id = ?",
                    [req.session.profile],
                    (err2, result2) => {
                        if (err2) throw err2;
                        else res.render("tour/tour", {
                            payments: result,
                            company: result2[0]
                        });
                    }
                );
        }
    );
};

module.exports = tour;
