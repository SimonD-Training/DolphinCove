const adminware = (req, res, next) => {
    if (!req.session.admin) res.sendStatus(401);
    else if (req.session.admin) next();
}

module.exports = adminware;