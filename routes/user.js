'use strict';
const express = require('express');
const {oneOf, check, body, validationResult} = require('express-validator/check');

const ErrorJson = require('../jsonFormats/responses/ErrorJson');
const redirectNonMemberEjs=require('../middlewares/redirectNonMemberEjs');
const userSessionCheck=require('../middlewares/userSessionCheck');
const userLoggedInEjsProps = require('../middlewares/userLoggedInEjsProps');
const UserAccountController = require('../controllers/UserAccountController');
const userAccountController = new UserAccountController();
const router = express.Router();


//// apply middleware to set ejs user login props
router.use(userLoggedInEjsProps);


/** EJS render routes **/
router.get("/profile",redirectNonMemberEjs, async (req, res) => {
    const userProfile = await userAccountController.handleUserProfile(req, res);
    res.render('layout', {page: 'userProfile', userProfile});
});

router.get("/history", redirectNonMemberEjs, async (req, res) => {
    const history = await userAccountController.handlePurchaseHistory(req, res);
    console.log('History' + history.toString());
    res.render('layout', {page: 'purchaseHistory', history});
});
/** EJS render routes **/


/**
 * @swagger
 * tags:
 *   name: UserAccount
 *   description: Routes of operations for user account
 */


/**
 * @swagger
 * /user/logout:
 *   get:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - UserAccount
 *     description: User logout process (clean up  cookies etc.)
 *     produces:
 *     - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: Success!
 */
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.json({msg: 'Successfully logout'});
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - UserAccount
 *     description: User login process. The email and password will be used to identify the user.
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: email
 *       description: The email address of the user for login.
 *       in: formData
 *       required: true
 *       type: string
 *     - name: password
 *       description: The password of the user for login.
 *       in: formData
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Success!
 */
router.post("/login", [
        check('email').isEmail(),
        check('password').isLength({min: 5})
    ], function (req, res) {

    const errors = validationResult(req);
    const errorMsg = 'Invalid email or password'
    console.log(req.body)

    if(!errors.isEmpty()){
        return res.status(302).json({errors: errorMsg});
    }else{
        userAccountController.handleLogin(req, res);
    }
});

/**
 * @swagger
 * /user/registration:
 *   post:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - UserAccount
 *     description: Registration process for a new user.
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: firstName
 *       description: The first name of the user.
 *       in: formData
 *       required: true
 *       type: string
 *     - name: lastName
 *       description: The last name of the user.
 *       in: formData
 *       required: false
 *       type: string
 *     - name: birthday
 *       description: The birthday of the user.
 *       in: formData
 *       required: false
 *       type: string
 *     - name: email
 *       description: The email address of the user for login after registration.
 *       in: formData
 *       required: true
 *       type: string
 *     - name: password
 *       description: The password of the user for login after registration.
 *       in: formData
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Success!
 */
router.post("/registration", [
        check('email').trim().not().isEmpty().withMessage('Email is required'),
        check('email').isEmail().withMessage('Your email is not valid'),
        check('password').not().isEmpty().withMessage('Password is required'),
        check('password').isAlphanumeric().withMessage('Password must only contain letters or numbers'),
        check('password').isLength({min: 5}).withMessage('At least 5 characters long'),
        check('phone').not().isEmpty().withMessage('Phone is required'),
        check('phone').isLength({min: 8, max: 8}).withMessage('Your phone number should be 8 digits'),
        check('phone').isInt().withMessage('Your phone number is not valid'),
        check('firstName').trim().not().isEmpty().withMessage('First name is required'),
        check('firstName').isAlpha().withMessage('First name is not valid'),
        check('lastName').trim().not().isEmpty().withMessage('Last name is required'),
        check('lastName').isAlpha().withMessage('Last name is not valid'),
        check('birthday').not().isEmpty().withMessage('Birthday is required')
    ], function (req, res) {

    const errors = validationResult(req);
    console.log(req.body);

    if(!errors.isEmpty()){
        return res.status(302).json({errors: errors.array({ onlyFirstError: true })})
    }else{
        userAccountController.handleRegistration(req, res);
    }
});

/**
 * @swagger
 * /user/redeem-credits:
 *   post:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - UserAccount
 *     description: Redeem credits to user. Buying songs or album using credits is one of the ways for user to purchase products from the system.
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: redeemCode
 *       description: The code for redeeming the credits.
 *       in: formData
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Success!
 */
router.post("/redeem-credits", userSessionCheck, (req, res) => {
    userAccountController.handleRedeemCredits(req, res);
});

/**
 * @swagger
 * /user/refund:
 *   post:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - UserAccount
 *     description: Allow the user to request refunding for the purchased (within 3 days) album or song.
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: orderId
 *       description: The purchase order Id.
 *       in: formData
 *       required: true
 *       type: string
 *     - name: albumOrSongId
 *       description: The album or song to refund.
 *       in: formData
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Success!
 */
router.post("/refund", userSessionCheck, (req, res) => {
    userAccountController.handleRefund(req, res)
});

module.exports = router;