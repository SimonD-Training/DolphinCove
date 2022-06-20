const login = (req, res) => {
    res.render("login/login", {
        loggedIn: req.session.loggedIn ? "LOG OUT" : "LOG IN",
        url: req.session.loggedIn ? "/logout" : "/login",
    });
};

module.exports = login;
