const index = (req, res) => {
    res.render("index", {
        loggedIn: req.session.loggedIn ? "LOG OUT" : "LOG IN",
        url: req.session.loggedIn ? "/logout" : "/login",
    });
};

module.exports = index;
