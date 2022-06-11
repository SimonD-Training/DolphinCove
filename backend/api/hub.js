//.....Requirements.....//
const express = require("express");
const bcrypt = require("bcrypt");
const database = require("../lib/db/database");

//.....Initializing Router.....//
let router = express.Router();

//......API Routes.....//
//Create
router.post("/profile/tour_co", (req, res) => {
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
});
router.post("/program", (req, res) => {
    database.query(
        "INSERT INTO programs (program_cost, program_name, datetime) VALUES (?,?,?);",
        [req.body.program_cost, req.body.program_name, req.body.datetime],
        (err2) => {
            if (Err2) throw err2;
            else res.send(true);
        }
    );
});
router.post("/booking", (req, res) => {
    database.query("SELECT * FROM defaults;", (err, result) => {
        if (err) throw err;
        else
            database.query(
                "INSERT INTO clients NATURAL JOIN bookings NATURAL JOIN payments (fname, lname, voucher, date, tour_co_id, hotel_id, program_id, amnt, statement_date, date_rendered, payment_method_id, credit) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);",
                [
                    req.body.fname,
                    req.body.lname,
                    result[0].voucher,
                    req.body.date,
                    result[0].tour_co_id,
                    req.body.hotel_id,
                    req.body.program_id,
                    req.body.amnt,
                    req.body.statement_date,
                    req.body.date_rendered,
                    req.body.payment_method_id,
                    req.body.credit,
                ],
                (err) => {
                    if (err) throw err;
                    else res.send(true);
                }
            );
    });
});
router.post("/tour/booking", (req, res) => {
    database.query(
        "SELECT payment_id FROM vouchers WHERE voucher = ?, date = ?;",
        [req.body.voucher, req.body.date],
        (err, result) => {
            if (err) throw err;
            else
                database.query(
                    "SELECT payment_id FROM payments WHERE tour_co_id = ?;",
                    [req.body.tour_co_id],
                    (err2, result2) => {
                        if (err2) throw err2;
                        else {
                            Array.from(result).forEach((e) => {
                                if (e in Array.from(result2)) {
                                    let payment_id = e.payment_id;
                                    database.query(
                                        "INSERT INTO clients NATURAL JOIN bookings (fname, lname, payment_id, voucher, date, tour_co_id, hotel, program_id) VALUES (?,?,?,?,?,?,?);",
                                        [
                                            req.body.fname,
                                            req.body.lname,
                                            payment_id,
                                            req.body.voucher,
                                            req.body.date,
                                            req.body.tour_co_id,
                                            req.body.hotel,
                                            req.body.program_id,
                                        ],
                                        (err3) => {
                                            if (err3) throw err3;
                                            else
                                                database.query(
                                                    "SELECT amnt FROM payments WHERE payment_id = ?;",
                                                    [payment_id],
                                                    (err4, result4) => {
                                                        if (err4) throw err4;
                                                        else
                                                            database.query(
                                                                "SELECT program_cost FROM programs WHERE program_id = ?;",
                                                                [
                                                                    req.body
                                                                        .program_id,
                                                                ],
                                                                (
                                                                    err5,
                                                                    result5
                                                                ) => {
                                                                    if (err5)
                                                                        throw err5;
                                                                    else
                                                                        database.query(
                                                                            "UPDATE payments SET amnt = ? WHERE payment_id = ?;",
                                                                            [
                                                                                result4.amnt +
                                                                                    result5.program_cost,
                                                                                payment_id,
                                                                            ],
                                                                            (
                                                                                err6
                                                                            ) => {
                                                                                if (
                                                                                    err6
                                                                                )
                                                                                    throw err6;
                                                                                else
                                                                                    res.send(
                                                                                        true
                                                                                    );
                                                                            }
                                                                        );
                                                                }
                                                            );
                                                    }
                                                );
                                        }
                                    );
                                }
                            });
                        }
                    }
                );
        }
    );
});
router.post("/tourbook", (req, res) => {
    database.query(
        "INSERT INTO payments (statement_date, payment_method_id, credit, tour_co_id) VALUES (?,?,?,?);",
        [
            req.body.statement_date,
            req.body.payment_method_id,
            req.body.credit,
            req.body.tour_co_id,
        ],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
});
router.post("/tourbook/addvoucher", (req, res) => {
    database.query(
        "INSERT INTO vouchers (payment_id, voucher, date) VALUES (?,?,?);",
        [req.body.payment_id, req.body.voucher, req.body.date],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
});

//Read
router.post("/login", (req, res) => {
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
                    }
                );
        }
    );
});
router.get("/api/profiles", (req, res) => {
    database.query("SELECT * FROM tour_companies;", (err, result) => {
        if (err) throw err;
        else res.send(result);
    });
});
router.get("/api/profile/:id", (req, res) => {
    database.query(
        "SELECT * FROM tour_companies WHERE tour_co_id = ?;",
        [req.params.id],
        (err, result) => {
            if (err) throw err;
            else res.send(result);
        }
    );
});
router.get("/api/programs", (req, res) => {
    database.query("SELECT * FROM programs;", (err, result) => {
        if (err) throw err;
        else res.send(result);
    });
});
router.get("/api/bookings", (req, res) => {
    database.query(
        "SELECT * FROM clients NATURAL JOIN bookings NATURAL JOIN hotels NATURAL JOIN programs;",
        (err, result) => {
            if (err) throw err;
            else res.send(result);
        }
    );
});
router.get("/api/payments", (req, res) => {
    database.query(
        "SELECT * FROM payments NATURAL JOIN tour_companies JOIN payment_methods;",
        [req.params.id],
        (err, result) => {
            if (err) throw err;
            else res.send(result);
        }
    );
});
router.get("/api/payments/:id", (req, res) => {
    database.query(
        "SELECT * FROM payments NATURAL JOIN tour_companies NATURAL JOIN payment_methods WHERE tour_co_id = ?;",
        [req.params.id],
        (err, result) => {
            if (err) throw err;
            else res.send(result);
        }
    );
});
router.get("/api/payment/:id", (req, res) => {
    database.query(
        "SELECT * FROM vouchers WHERE payment_id = ?;",
        [req.params.id],
        (err, result) => {
            if (err) throw err;
            else res.send(result);
        }
    );
});

//Update
router.put("/profile/:id", (req, res) => {
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
});
router.put("/profile/email/:id", (req, res) => {
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
});
router.put("/profile/password/:id", (req, res) => {
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
});
router.put("/program/:id", (req, res) => {
    database.query(
        "UPDATE programs SET program_cost = ?, program_name = ?, datetime = ? WHERE program_id = ?;",
        [
            req.body.program_cost,
            req.body.program_name,
            req.body.datetime,
            req.params.id,
        ],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
});
router.put("/payments/:id", (req, res) => {
    database.query(
        "UPDATE payments SET payment_method_id = ?, credit = ? WHERE payment_id = ?;",
        [req.body.payment_method_id, req.body.credit, req.params.id],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
});
router.put("/voucher/:id", (req, res) => {
    database.query(
        "UPDATE vouchers SET voucher = ?, date = ? WHERE voucher_id = ?;",
        [req.body.voucher, req.body.date, req.params.id],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
});

//Delete
router.delete("/profile/:id", (req, res) => {
    database.query(
        "DELETE FROM tour_companies WHERE tour_co_id = ?",
        [req.body.id],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
});
router.delete("/program/:id", (req, res) => {
    database.query(
        "DELETE FROM programs WHERE program_id = ?",
        [req.body.id],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
});
router.delete("/pre-book/remvoucher/:id", (req, res) => {
    database.query(
        "DELETE FROM vouchers WHERE voucher_id = ?;",
        [req.params.id],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
});
router.delete("/payment/cancel/:id", (req, res) => {
    database.query(
        "DELETE FROM payments NATURAL JOIN vouchers WHERE payment_id = ?",
        [
            req.body.payment_id,
            req.body.voucher,
            req.body.date,
            req.body.tour_co_id,
        ],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
});

module.exports = router;
