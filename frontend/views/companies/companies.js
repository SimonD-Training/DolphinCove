const database = require("../../../backend/lib/db/database");

const companies = (req, res) => {
    database.query(
        "SELECT * FROM tour_companies NATURAL JOIN login WHERE NOT tour_co_id =  5;",
        (err, result) => {
            if (err) throw err;
            else
                res.render("companies/companies", {
                    companies: result,
                });
        }
    );
};

module.exports = companies;
