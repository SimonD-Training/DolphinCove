const sessionware = (req, res, next) => {
    if (!req.session.loggedIn) res.sendStatus(401);
    else if (req.session.loggedIn) next();
}

module.exports = sessionware;