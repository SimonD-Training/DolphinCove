const database = require("../../../backend/lib/db/database");

const manage_profile = (req, res) => {
    database.query(
        "SELECT * FROM tour_companies NATURAL JOIN login WHERE tour_co_id = ?;",
        [req.session.profile],
        (err, result) => {
            if (err) throw err;
            else {
                if (result[0])
                    res.render("manage_profile/manage_profile", {
                        tour_company: result[0],
                    });
                else res.redirect("/session/login");
            }
        }
    );
};

module.exports = manage_profile;
