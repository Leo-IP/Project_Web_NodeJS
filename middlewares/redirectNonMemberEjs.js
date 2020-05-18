module.exports = (req, res, next) => {
    if (req.session.memberId) return next();
    //// logged out user, redirect to home page
    res.redirect('/store/');
};