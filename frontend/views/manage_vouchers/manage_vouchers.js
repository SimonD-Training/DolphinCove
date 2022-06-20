const database = require("../../../backend/lib/db/database");

const manage_vouchers = (req, res) => {
    database.query(
        "SELECT * FROM vouchers NATURAL JOIN payments WHERE payment_id = ? AND tour_co_id = ?;",
        [parseInt(req.params.payment_id), req.session.profile],
        (err, result) => {
            if (err) {
                console.log(err);
                res.redirect("/login");
            } else
                res.render("manage_vouchers/manage_vouchers", {
                    vouchers: result,
                    payment_id: req.params.payment_id,
                });
        }
    );
};

module.exports = manage_vouchers;
