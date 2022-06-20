//.....Requirements.....//
const database = require("../../lib/db/database");

//.....Create.....//
exports.logBooking = (req, res) => {
    database.query(
        "SELECT program_cost FROM programs WHERE program_id = ?;",
        [req.body.program_id],
        (err0, result0) => {
            if (err0) {
                res.sendStatus(500);
                console.log(err0);
            } else
                database.query("SELECT * FROM defaults;", (err, result) => {
                    if (err) {
                        res.sendStatus(500);
                        console.log(err);
                    } else
                        database.query(
                            "BEGIN; INSERT INTO clients (fname, lname) VALUES (?,?); SET @client = LAST_INSERT_ID(); INSERT INTO payments  (amnt, statement_date, payment_method_id, credit, tour_co_id) VALUES (?,?,?,?,?); SET @payment = LAST_INSERT_ID(); INSERT INTO vouchers (voucher, date, payment_id) VALUES (?,?,@payment); INSERT INTO bookings (client_id, voucher, date, payment_id, hotel_id, program_id) VALUES (@client,?,?,@payment,?,?); COMMIT;",
                            [
                                req.body.fname,
                                req.body.lname,
                                result0[0].program_cost,
                                new Date().toISOString().slice(0, 10),
                                parseInt(req.body.payment_method_id),
                                0,
                                result[0].tour_co_id,
                                result[0].voucher,
                                req.body.date,
                                result[0].voucher,
                                req.body.date,
                                parseInt(req.body.hotel_id),
                                parseInt(req.body.program_id),
                            ],
                            (err) => {
                                if (err) {
                                    res.sendStatus(500);
                                    console.log(err);
                                } else res.send(true);
                            }
                        );
                });
        }
    );
};

exports.logTourBooking = (req, res) => {
    database.query(
        "SELECT payment_id FROM vouchers WHERE voucher = ?, date = ?;",
        [req.body.voucher, req.body.date],
        (err, result) => {
            if (err) {
                res.sendStatus(500);
                console.log(err);
            } else
                database.query(
                    "SELECT payment_id FROM payments WHERE tour_co_id = ?;",
                    [req.body.tour_co_id],
                    (err2, result2) => {
                        if (err2) {
                            res.sendStatus(500);
                            console.log(err2);
                        } else {
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
                                            if (err3) {
                                                res.sendStatus(500);
                                                console.log(err3);
                                            } else
                                                database.query(
                                                    "SELECT amnt FROM payments WHERE payment_id = ?;",
                                                    [payment_id],
                                                    (err4, result4) => {
                                                        if (err4) {
                                                            res.sendStatus(500);
                                                            console.log(err4);
                                                        } else
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
                                                                    if (err5) {
                                                                        res.sendStatus(
                                                                            500
                                                                        );
                                                                        console.log(
                                                                            err5
                                                                        );
                                                                    } else
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
                                                                                ) {
                                                                                    res.sendStatus(
                                                                                        500
                                                                                    );
                                                                                    console.log(
                                                                                        err6
                                                                                    );
                                                                                } else
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
};

exports.createBooking = (req, res) => {
    database.query(
        "INSERT INTO payments (statement_date, payment_method_id, credit, tour_co_id) VALUES (?,?,?,?);",
        [
            req.body.statement_date,
            parseInt(req.body.payment_method_id),
            parseInt(req.body.credit),
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

exports.createBookingVoucher = (req, res) => {
    database.query(
        "INSERT INTO vouchers (payment_id, voucher, date) VALUES (?,?,?);",
        [
            parseInt(req.body.payment_id),
            parseInt(req.body.voucher),
            req.body.date,
        ],
        (err) => {
            if (err) {
                res.sendStatus(500);
                console.log(err);
            } else res.send(true);
        }
    );
};

//.....Read.....//
exports.getBookings = (req, res) => {
    database.query(
        "SELECT * FROM clients NATURAL JOIN bookings NATURAL JOIN hotels NATURAL JOIN programs;",
        (err, result) => {
            if (err) {
                res.sendStatus(500);
                console.log(err);
            } else res.send(result);
        }
    );
};

exports.getPayments = (req, res) => {
    database.query(
        "SELECT * FROM payments NATURAL JOIN tour_companies NATURAL JOIN payment_methods;",
        (err, result) => {
            if (err) {
                res.sendStatus(500);
                console.log(err);
            } else res.send(result);
        }
    );
};

exports.getCompanyPayments = (req, res) => {
    database.query(
        "SELECT * FROM payments NATURAL JOIN tour_companies NATURAL JOIN payment_methods WHERE tour_co_id = ?;",
        [req.params.id],
        (err, result) => {
            if (err) {
                res.sendStatus(500);
                console.log(err);
            } else res.send(result);
        }
    );
};

exports.getPaymentVouchers = (req, res) => {
    database.query(
        "SELECT * FROM vouchers WHERE payment_id = ?;",
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
exports.updatePayment = (req, res) => {
    database.query(
        "UPDATE payments SET payment_method_id = ?, credit = ? WHERE payment_id = ?;",
        [req.body.payment_method_id, req.body.credit, req.params.id],
        (err, result) => {
            if (err) {
                res.sendStatus(500);
                console.log(err);
            } else res.send(true);
        }
    );
};

exports.updateBooking = (req, res) => {
    database.query(
        "SELECT program_cost FROM programs WHERE program_id = ?;",
        [req.body.program_id],
        (err, cost) => {
            database.query(
                "UPDATE bookings SET date = ?, hotel_id = ?, program_id = ? WHERE booking_id = ?;",
                [
                    req.body.date,
                    parseInt(req.body.hotel_id),
                    parseInt(req.body.program_id),
                    req.params.id,
                ],
                (err, result) => {
                    if (err) {
                        res.sendStatus(500);
                        console.log(err);
                    } else
                        database.query(
                            "UPDATE payments SET amnt = ? WHERE payment_id = ?",
                            [cost[0].program_cost, req.body.payment_id],
                            (err) => {
                                if (err) {
                                    res.sendStatus(500);
                                    console.log(err);
                                } else res.send(true);
                            }
                        );
                }
            );
        }
    );
};

exports.updateVoucher = (req, res) => {
    database.query(
        "UPDATE vouchers SET voucher = ?, date = ? WHERE voucher_id = ?;",
        [req.body.voucher, req.body.date, req.params.id],
        (err, result) => {
            if (err) {
                res.sendStatus(500);
                console.log(err);
            } else res.send(true);
        }
    );
};

//.....Delete.....//
exports.removeBooking = (req, res) => {
    database.query(
        "DELETE FROM bookings WHERE booking_id = ?; SET @del = ROW_COUNT(); SELECT @del;",
        [req.params.id],
        (err, result) => {
            if (err || result[result.length - 1][0]["@del"] < 1) {
                res.sendStatus(500);
                console.log(err);
            } else res.send(true);
        }
    );
};

exports.removeVoucher = (req, res) => {
    database.query(
        "DELETE FROM vouchers WHERE voucher_id = ?; SET @del = ROW_COUNT(); SELECT @del;",
        [req.params.id],
        (err, result) => {
            if (err || result[result.length - 1][0]["@del"] < 1) {
                res.sendStatus(500);
                console.log(err);
            } else res.send(true);
        }
    );
};

exports.cancelPayment = (req, res) => {
    database.query(
        "DELETE payments, vouchers FROM payments NATURAL JOIN vouchers WHERE payment_id = ?; SET @del = ROW_COUNT(); SELECT @del;",
        [parseInt(req.params.id)],
        (err, result) => {
            if (err || result[result.length - 1][0]["@del"] < 1) {
                database.query(
                    "DELETE FROM payments WHERE payment_id = ?; SET @del = ROW_COUNT(); SELECT @del;",
                    [parseInt(req.params.id)],
                    (err, result) => {
                        if (err || result[result.length - 1][0]["@del"] < 1) {
                            res.sendStatus(500);
                            console.log(err);
                        } else res.send(true);
                    }
                );
            } else res.send(true);
        }
    );
};
