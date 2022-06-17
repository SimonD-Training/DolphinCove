//.....Requirements.....//
const database = require("../../lib/db/database");

//.....Create.....//
exports.logBooking = (req, res) => {
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
}

exports.logTourBooking = (req, res) => {
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
}

exports.createBooking = (req, res) => {
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
}

exports.createBookingVoucher = (req, res) => {
    database.query(
        "INSERT INTO vouchers (payment_id, voucher, date) VALUES (?,?,?);",
        [req.body.payment_id, req.body.voucher, req.body.date],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
}

//.....Read.....//
exports.getBookings = (req, res) => {
    database.query(
        "SELECT * FROM clients NATURAL JOIN bookings NATURAL JOIN hotels NATURAL JOIN programs;",
        (err, result) => {
            if (err) throw err;
            else res.send(result);
        }
    );
}

exports.getPayments = (req, res) => {
    database.query(
        "SELECT * FROM payments NATURAL JOIN tour_companies NATURAL JOIN payment_methods;",
        (err, result) => {
            if (err) throw err;
            else res.send(result);
        }
    );
}

exports.getCompanyPayments = (req, res) => {
    database.query(
        "SELECT * FROM payments NATURAL JOIN tour_companies NATURAL JOIN payment_methods WHERE tour_co_id = ?;",
        [req.params.id],
        (err, result) => {
            if (err) throw err;
            else res.send(result);
        }
    );
}

exports.getPaymentVouchers = (req, res) => {
    database.query(
        "SELECT * FROM vouchers WHERE payment_id = ?;",
        [req.params.id],
        (err, result) => {
            if (err) throw err;
            else res.send(result);
        }
    );
}

//.....Update.....//
exports.updatePayment = (req, res) => {
    database.query(
        "UPDATE payments SET payment_method_id = ?, credit = ? WHERE payment_id = ?;",
        [req.body.payment_method_id, req.body.credit, req.params.id],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
}

exports.updateVoucher = (req, res) => {
    database.query(
        "UPDATE vouchers SET voucher = ?, date = ? WHERE voucher_id = ?;",
        [req.body.voucher, req.body.date, req.params.id],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
}

//.....Delete.....//
exports.removeVoucher = (req, res) => {
    database.query(
        "DELETE FROM vouchers WHERE voucher_id = ?;",
        [req.params.id],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
}

exports.cancelPayment = (req, res) => {
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
}