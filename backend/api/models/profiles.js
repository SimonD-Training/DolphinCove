//.....Requirements.....//
const database = require("../../lib/db/database");
const bcrypt = require("bcrypt");

//.....Create.....//
exports.createProfile = (req, res) => {
    bcrypt.hash("12345678", 10, (err, hash) => {
        if (err) {
            res.sendStatus(500);
            console.log(err);
        } else
            database.query(
                "BEGIN; INSERT INTO tour_companies (tour_company, tour_company_address, tour_company_desc) VALUES (?,?,?); SET @tour = LAST_INSERT_ID(); INSERT INTO login (email, tour_co_id, password) VALUES (?,@tour,?); COMMIT;",
                [
                    req.body.tour_company,
                    req.body.tour_company_address,
                    req.body.tour_company_desc,
                    req.body.email,
                    hash,
                ],
                (err2) => {
                    if (err2) {
                        res.sendStatus(500);
                        console.log(err2);
                    } else res.send(true);
                }
            );
    });
};

//.....Read.....//
exports.login = (req, res) => {
    database.query(
        "SELECT password, tour_co_id FROM login NATURAL JOIN tour_companies WHERE email = ?;",
        [req.body.email],
        (err, result) => {
            if (err) {
                res.sendStatus(500);
                console.log(err);
            } else if (result.length != 1) res.status(409).send(false);
            else
                bcrypt.compare(
                    req.body.password,
                    Buffer.from(result[0].password, "binary").toString(),
                    (err, same) => {
                        if (err) {
                            res.sendStatus(500);
                            console.log(err);
                        } else if (same) {
                            req.session.loggedIn = true;
                            req.session.company =
                                result[0].tour_co_id == 5 ? false : true;
                            req.session.admin =
                                result[0].tour_co_id == 5 ? true : false;
                            if (req.session.company)
                                req.session.profile = result[0].tour_co_id;
                            res.send(
                                req.session.company
                                    ? "/session/tour"
                                    : "/session/staff"
                            );
                        } else res.status(401).send(false);
                    }
                );
        }
    );
};

exports.getProfiles = (req, res) => {
    database.query("SELECT * FROM tour_companies;", (err, result) => {
        if (err) {
            res.sendStatus(500);
            console.log(err);
        } else res.send(result);
    });
};

exports.getProfile = (req, res) => {
    database.query(
        "SELECT * FROM tour_companies WHERE tour_co_id = ?;",
        [req.params.id],
        (err, result) => {
            if (err) {
                res.sendStatus(500);
                console.log(err);
            } else res.send(result);
        }
    );
};

//.....Update.....//
exports.updateProfile = (req, res) => {
    database.query(
        "UPDATE tour_companies SET tour_company = ?, tour_company_address = ?, tour_company_desc = ? WHERE tour_co_id = ?;",
        [
            req.body.tour_company,
            req.body.tour_company_address,
            req.body.tour_company_desc,
            req.session.profile,
        ],
        (err) => {
            if (err) {
                res.sendStatus(500);
                console.log(err);
            } else res.send(true);
        }
    );
};

exports.updateTourCo = (req, res) => {
    database.query(
        "UPDATE tour_companies SET tour_company = ?, tour_company_address = ?, tour_company_desc = ? WHERE tour_co_id = ?;",
        [
            req.body.tour_company,
            req.body.tour_company_address,
            req.body.tour_company_desc,
            req.params.id,
        ],
        (err) => {
            if (err) {
                res.sendStatus(500);
                console.log(err);
            } else res.send(true);
        }
    );
};

exports.updateLoginEmail = (req, res) => {
    database.query("UPDATE login SET email = ? WHERE tour_co_id = ?;", [req.body.email, req.params.id], (err) => {
        if (err) {
            res.sendStatus(500);
            console.log(err);
        } else res.send(true);
    });
};

exports.updateLoginPass = (req, res) => {
    bcrypt.hash(req.body.password, 10, (err2, hash) => {
        if (err2) {
            res.sendStatus(500);
            console.log(err2);
        } else
            database.query("UPDATE login SET password = ? WHERE tour_co_id = ?;", [hash, req.params.id], (err3) => {
                if (err3) {
                    res.sendStatus(500);
                    console.log(err3);
                } else res.send(true);
            });
    });
};

//.....Delete.....//
exports.deleteProfile = (req, res) => {
    database.query(
        "DELETE FROM tour_companies WHERE tour_co_id = ?; SET @del = ROW_COUNT(); SELECT @del;",
        [req.params.id],
        (err, result) => {
            if (err || result[result.length - 1][0]["@del"] < 1) {
                res.sendStatus(500);
                console.log(err);
            } else res.send(true);
        }
    );
};
