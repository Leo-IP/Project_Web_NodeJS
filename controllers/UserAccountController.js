'use strict';

const UserAccountDao = require('../models/UserDao');
const RedeemCreditsDao = require('../models/RedeemCreditsDao');
const CreditDataDao = require('../models/CreditDataDao');
const OrderDataDao = require('../models/OrderDataDao');
const RefundDataDao = require('../models/RefundDataDao');

class UserAccountController{

    constructor(){
        this.userAccountDao = new UserAccountDao();
        this.redeemCreditsDao = new RedeemCreditsDao();
        this.creditDataDao = new CreditDataDao();
        this.orderDataDao = new OrderDataDao();
        this.refundDataDao = new RefundDataDao();
    }

    createUserAccount(email, password, firstName, lastName, birthday, phone){
        return this.userAccountDao.createUserAccount(email, password, firstName, lastName, birthday, phone);
    }

    login(email, password){
        return this.userAccountDao.login(email, password);
    }

    getUserAccount(memberId){
        return this.userAccountDao.getUserAccount(memberId);
    }

    getCreditData(code){
        return this.creditDataDao.getCreditData(code);
    }

    deactCreditData(creditId){
        return this.creditDataDao.deactCreditData(creditId);
    }

    updateUserCredit(memberId, amounts){
        return this.userAccountDao.updateUserCredit(memberId, amounts);
    }

    updateUserLoyaltyPointRF(memberId, amounts){
        return this.userAccountDao.updateLoyaltyPointRF(memberId, amounts);
    }

    createRedeemCreditRecord(creditId, memberId){
        return this.redeemCreditsDao.createRedeemRecord(creditId, memberId);
    }

    createRefundRecord(memberId, albumId, orderId, addDate, approved){
        return this.refundDataDao.createRefundRecord(memberId, albumId, orderId, addDate, approved);
    }

    getUserAlbumOrderDetail(orderId, productId){
        return this.userAccountDao.getUserAlbumOrderDetail(orderId, productId);
    }

    getUserSongOrderDetail(orderId, productId){
        return this.userAccountDao.getUserSongOrderDetail(orderId, productId);
    }

    getPurchaseHistory(memberId){
        return this.orderDataDao.getUserAllOrderRecord(memberId);
    }

    getOrderData(orderId){
        return this.orderDataDao.getUserOrderRecord(orderId);
    }

    isUserExists(email){
        return this.userAccountDao.isUserExists(email);
    }

    isOrderMoreThanThreeDays(addDate){
        var addDate = new Date(addDate);
        var today = new Date();

        let timeDiff = Math.abs(today.getTime() - addDate.getTime());
        let diffDays = Math.floor(timeDiff/ (1000 * 3600 * 24));

        if(diffDays > 3){
            return 1;
        }else{
            return 0;
        }
    }

    async handleLogin(req, res){

        var email = req.body.email;
        var password = req.body.password;

        const results  = await this.login(email, password);

        if(results.length > 0){
            var memberId = results[0].MemberId;
            req.session.memberId = memberId;
            res.status(200).json({msg:'You are successfully logged in!'});
        }else{
            const errorMsg = 'Invalid email or password'
            res.status(302).json({errors: errorMsg});
        }
    }

    async handleRegistration(req, res){
        var email = req.body.email;
        var password = req.body.password;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var birthday = req.body.birthday;
        var phone = req.body.phone;

        const results  = await this.isUserExists(email);
        if(results.length < 1){
            const {results} = this.createUserAccount(email, password, firstName, lastName, birthday, phone);
            res.json({msg: results});
        }else{
            const errorMsg = 'Email already exists, please try another one'
            res.status(302).json({errors: errorMsg});
        }
    }

    async handleUserProfile(req, res){

        // var memberId = req.session.memberId;
        var memberId = req.session.memberId;

        const results = await this.getUserAccount(memberId);

        if(results.length > 0){
            var birthdayTime = Date.parse(results[0].Birthday);
            var birthday = new Date(birthdayTime);
            var birthdayYear = birthday.getFullYear();
            var birthdayMonth = birthday.getMonth()+1;
            var birthdayDate = birthday.getDate();

            if(birthdayMonth < 10){
                birthdayMonth = '0' + birthdayMonth
            }

            if(birthdayDate < 10){
                birthdayDate = '0' + birthdayDate
            }

            results[0].Birthday = birthdayYear + '-' + birthdayMonth + '-' + birthdayDate;

        }
        return JSON.stringify(results[0]);
    }

    async handleRedeemCredits(req, res){

        var memberId = req.session.memberId;
        var code = req.body.code;

        const results = await this.getCreditData(code);
        if(results.length > 0){
            var amounts =  results[0].Amounts;
            var creditId = results[0].CreditId;
            this.deactCreditData(creditId);
            this.createRedeemCreditRecord(creditId, memberId);
            this.updateUserCredit(memberId, amounts);
            res.json({amounts: amounts, msg : 'Success'})
        }else{
            res.status(302).json({errors:'Credit code is not valid'});
        }
    }

    async handlePurchaseHistory(req, res){
        var memberId = req.session.memberId;
        var promises = [];
        const orders = await this.getPurchaseHistory(memberId);

        for(var i = 0; i < orders.length ; i++){

            var orderId = orders[i].OrderId;
            var productId = orders[i].ProductId;

            if(orders[i].ProductType === 'A'){
               promises.push(this.getUserAlbumOrderDetail(orderId, productId))
            }else{
               promises.push(this.getUserSongOrderDetail(orderId, productId))
            }
        }

        return Promise.all(promises)
            .then(function(data){
            console.log('Data ' + JSON.stringify(data[0]))
            for(var i = 0; i < data.length ; i++){
                // console.log(data[i].AddDate)
                var addDateTime = new Date(data[i].AddDate).getTime()
                // console.log(addDateTime)
                var addDate = new Date (addDateTime);
                // console.log(addDate)

                var addDateYear = addDate.getFullYear();
                var addDateMonth = (addDate.getMonth() + 1);
                if(addDateMonth  < 10){
                    addDateMonth = '0' + addDateMonth
                }

                var addDateDate = addDate.getDate();
                if(addDateDate < 10){
                    addDateDate = '0' + addDateDate
                }

                var addDateHour = addDate.getHours();
                if(addDateHour < 10){
                    addDateHour = '0' + addDateHour
                }

                var addDateMinute = addDate.getMinutes()
                if(addDateMinute < 10){
                    addDateMinute = '0' + addDateMinute
                }

                var addDateSecond = addDate.getSeconds()
                if(addDateSecond < 10){
                    addDateSecond = '0' + addDateSecond
                }

                var addDateString = addDateYear + '-' +
                                    addDateMonth + '-' +
                                    addDateDate + ' ' +
                                    addDateHour + ':' +
                                    addDateMinute + ':' +
                                    addDateSecond

                // var addDate = new Date(addDateTime);
                // console.log(addDate)
                data[i].AddDate = addDateString
            }
            console.log('Promise ' + JSON.stringify(data))
            return data
        })
    }

    async handleRefund(req, res){

        // var memberId = req.body.memberId;
        var memberId = req.session.memberId;
        var orderId = req.body.orderId;

        const results = await this.getOrderData(orderId)

        if(results.length > 0){
            var addDate = new Date(results[0].AddDate)
            console.log(results[0])
            var payBy = results[0].PayBy
            var productType = results[0].ProductType
            var cost = results[0].Cost
            if(productType === 'S'){
                var approved = 0
                this.createRefundRecord(memberId, orderId, approved)
                res.status(302).json({errors: 'Cannot refund song purchase'})
            }else if(payBy === 'LP') {
                var approved = 0
                this.createRefundRecord(memberId, orderId, approved)
                res.status(302).json({errors: 'Cannot refund loyalty point purchase'})
            }
            else if(this.isOrderMoreThanThreeDays(addDate) == 1){
                var approved = 0
                this.createRefundRecord(memberId, orderId, approved)
                res.status(302).json({errors: 'Cannot refund purchase more than 3 days'})
            }else{
                var approved = 1
                this.createRefundRecord(memberId, orderId, approved)
                this.updateUserCredit(memberId, cost);
                const amounts = cost * 0.2;
                this.updateUserLoyaltyPointRF(memberId, amounts);
                res.json({msg: 'Success'})
            }
        }else{
            res.json({errors: 'Order does not exists'});
        }

    }
}

module.exports = UserAccountController;
