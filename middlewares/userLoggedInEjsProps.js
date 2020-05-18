'use strict';
module.exports = (req, res, next) => {
    if(req.session.memberId){
        res.locals.loggedIn = '1'
    }else{
        res.locals.loggedIn = '0';
    }
    next();
};