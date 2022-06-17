//.....Requirements.....//
const database = require("../../lib/db/database");
const bcrypt = require("bcrypt");

//.....Create.....//
exports.createProfile = (req, res) => {
    bcrypt.hash(req.body.password, process.env.SALT, (err, hash) => {
        if (err) throw err;
        else
            database.query(
                "INSERT INTO login NATURAL JOIN tour_companies (email, password, tour_co_id, tour_company, tour_company_address, tour_company_desc) VALUES (?,?,?,?,?,?);",
                [
                    req.body.email,
                    hash,
                    req.body.tour_co_id,
                    req.body.tour_company,
                    req.body.tour_company_address,
                    req.body.tour_company_desc,
                ],
                (err2) => {
                    if (err2) throw err2;
                    else res.send(true);
                }
            );
    });
}

//.....Read.....//
exports.login = (req, res) => {
    database.query(
        "SELECT password FROM login WHERE email = ?;",
        [req.body.password],
        (err, result) => {
            if (err) throw err;
            else if (result.length != 1) res.status(409).send(false);
            else
                bcrypt.compare(
                    req.body.password,
                    Buffer.from(result[0].password, "binary").toString(),
                    (err, same) => {
                        if (err) throw err;
                        else if (same) res.send(true);
                        else res.status(401).send(false);
                    }
                );
        }
    );
}


exports.getProfiles = (req, res) => {
    database.query("SELECT * FROM tour_companies;", (err, result) => {
        if (err) throw err;
        else res.send(result);
    });
};

exports.getProfile = (req, res) => {
    database.query(
        "SELECT * FROM tour_companies WHERE tour_co_id = ?;",
        [req.params.id],
        (err, result) => {
            if (err) throw err;
            else res.send(result);
        }
    );
};

//.....Update.....//
exports.updateProfile = (req, res) => {
    database.query(
        "UPDATE tour_companies SET tour_company = ?, tour_company_address = ?, tour_company_desc = ?;",
        [
            req.body.tour_company,
            req.body.tour_company_address,
            req.body.tour_company_desc,
        ],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
}

exports.updateLoginEmail = (req, res) => {
    database.query(
        "SELECT password FROM login WHERE email = ?;",
        [req.body.password],
        (err, result) => {
            if (err) throw err;
            else if (result.length != 1) res.status(409).send(false);
            else
                bcrypt.compare(
                    req.body.password,
                    Buffer.from(result[0].password, "binary").toString(),
                    (err, same) => {
                        if (err) throw err;
                        else if (same) {
                            database.query(
                                "UPDATE login SET email = ?;",
                                [req.body.new_email],
                                (err) => {
                                    if (err) throw err;
                                    else res.send(true);
                                }
                            );
                        }
                    }
                );
        }
    );
}

exports.updateLoginPass = (req, res) => {
    database.query(
        "SELECT password FROM login WHERE email = ?;",
        [req.body.password],
        (err, result) => {
            if (err) throw err;
            else if (result.length != 1) res.status(409).send(false);
            else
                bcrypt.compare(
                    req.body.password,
                    Buffer.from(result[0].password, "binary").toString(),
                    (err, same) => {
                        if (err) throw err;
                        else if (same) {
                            bcrypt.hash(
                                req.body.new_password,
                                process.env.SALT,
                                (err2, hash) => {
                                    if (err2) throw err2;
                                    else
                                        database.query(
                                            "UPDATE login SET password = ?;",
                                            [hash],
                                            (err3) => {
                                                if (err3) throw err;
                                                else res.send(true);
                                            }
                                        );
                                }
                            );
                        }
                    }
                );
        }
    );
}

//.....Delete.....//
exports.deleteProfile = (req, res) => {
    database.query(
        "DELETE FROM tour_companies WHERE tour_co_id = ?",
        [req.body.id],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
}