//.....Requirements.....//
const database = require("../../lib/db/database");

//.....Create.....//
exports.createProgram = (req, res) => {
    database.query(
        "INSERT INTO programs (program_cost, program_name, datetime) VALUES (?,?,?);",
        [req.body.program_cost, req.body.program_name, req.body.datetime],
        (err) => {
            if (err) {
                res.sendStatus(500);
                console.log(err);
            } else res.send(true);
        }
    );
};

//.....Read.....//
exports.getPrograms = (req, res) => {
    database.query(
        "SELECT * FROM programs ORDER BY datetime DESC;",
        (err, result) => {
            if (err) {
                res.sendStatus(500);
                console.log(err);
            } else res.send(result);
        }
    );
};

//.....Update.....//
exports.updateProgram = (req, res) => {
    database.query(
        "UPDATE programs SET program_cost = ?, program_name = ?, datetime = ? WHERE program_id = ?;",
        [
            req.body.program_cost,
            req.body.program_name,
            req.body.datetime,
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

//.....Delete.....//
exports.deleteProgram =
    ("/program/:id",
    (req, res) => {
        database.query(
            "DELETE FROM programs WHERE program_id = ?; SET @del = ROW_COUNT(); SELECT @del;",
            [req.body.id],
            (err, result) => {
                if (err || result[result.length-1][0]['@del'] < 1) {
                    res.sendStatus(500);
                    console.log(err);
                } else res.send(true);
            }
        );
    });
