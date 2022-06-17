const companyware = (req, res, next) => {
    if (!req.session.company) res.sendStatus(401);
    else if (req.session.company) next();
}

module.exports = companyware;