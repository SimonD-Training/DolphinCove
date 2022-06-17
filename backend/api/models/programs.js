//.....Requirements.....//
const database = require("../../lib/db/database");

//.....Create.....//
exports.createProgram = (req, res) => {
    database.query(
        "INSERT INTO programs (program_cost, program_name, datetime) VALUES (?,?,?);",
        [req.body.program_cost, req.body.program_name, req.body.datetime],
        (err2) => {
            if (Err2) throw err2;
            else res.send(true);
        }
    );
}

//.....Read.....//
exports.getPrograms = (req, res) => {
    database.query("SELECT * FROM programs ORDER BY datetime DESC;", (err, result) => {
        if (err) throw err;
        else res.send(result);
    });
}

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
            if (err) throw err;
            else res.send(true);
        }
    );
}

//.....Delete.....//
exports.deleteProgram = ("/program/:id", (req, res) => {
    database.query(
        "DELETE FROM programs WHERE program_id = ?",
        [req.body.id],
        (err) => {
            if (err) throw err;
            else res.send(true);
        }
    );
});