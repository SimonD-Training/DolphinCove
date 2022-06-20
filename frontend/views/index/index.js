const index = (req, res) => {
    res.render("index", {
        loggedIn: req.session.loggedIn ? "LOG OUT" : "LOG IN",
        url: req.session.loggedIn ? "/logout" : "/login",
        dashurl: req.session.admin ? '/session/staff' : '/session/tour',
    });
};

module.exports = index;
