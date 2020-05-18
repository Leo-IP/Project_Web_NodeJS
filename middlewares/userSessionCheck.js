module.exports = (req, res, next) => {
    if (req.session.memberId) return next();
    res.status(403).json(ErrorJson('Restricted'));
};