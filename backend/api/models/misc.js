exports.getHotels = (req, res) => {
    database.query("SELECT * FROM hotels;", (err, result) => {
        if (err) throw err;
        else res.send(result);
    });
};
