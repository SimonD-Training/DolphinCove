const database = require("../../../backend/lib/db/database");

const programs = (req, res) => {
    database.query(
        "SELECT * FROM programs ORDER BY datetime DESC;",
        (err, result) => {
            if (err) throw err;
            else
                res.render("programs/programs", {
                    programs: Array.from(result),
                    loggedIn: req.session.loggedIn ? 'LOG OUT' : 'LOG IN',
                    url: req.session.loggedIn ? '/logout' : '/login',
                });
        }
    );
};

module.exports = programs;
