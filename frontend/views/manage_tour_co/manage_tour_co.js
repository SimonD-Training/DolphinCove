const database = require("../../../backend/lib/db/database");

const manage_tour_co = (req, res) => {
    database.query(
        "SELECT * FROM tour_companies NATURAL JOIN login WHERE tour_co_id = ?;",
        [req.params.tour_co_id],
        (err, result) => {
            if (err) throw err;
            else
                res.render("manage_tour_co/manage_tour_co", {
                    tour_company: result[0],
                });
        }
    );
};

module.exports = manage_tour_co;
