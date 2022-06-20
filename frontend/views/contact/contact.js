const contact = (req, res) => {
    res.render("contact/contact", {
        loggedIn: req.session.loggedIn ? "LOG OUT" : "LOG IN",
        url: req.session.loggedIn ? "/logout" : "/login",
    });
};

module.exports = contact;
