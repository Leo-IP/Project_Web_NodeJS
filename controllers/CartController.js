'use strict';
const ManagementDao = require('../models/ManagementDao');
const UserAccountDao = require('../models/UserDao');
const RedeemCreditsDao = require('../models/RedeemCreditsDao');
const CreditDataDao = require('../models/CreditDataDao');
const OrderDataDao = require('../models/OrderDataDao');
const RefundDataDao = require('../models/RefundDataDao');

class CartController {
    constructor() {
        this.managementDao = new ManagementDao();
        this.userAccountDao = new UserAccountDao();
        this.redeemCreditsDao = new RedeemCreditsDao();
        this.creditDataDao = new CreditDataDao();
        this.orderDataDao = new OrderDataDao();
        this.refundDataDao = new RefundDataDao()

    }

    getAlbumList() {
        return this.managementDao.getAlbumList();
    }

    updateUserCredit(memberId, amounts){
        return this.userAccountDao.updateUserCreditAC(memberId, amounts);
    }

    updateLoyaltyPoint(memberId, amounts){
        return this.userAccountDao.updateLoyaltyPoint(memberId, amounts);
    }

    updateLoyaltyPointAC(memberId, amounts){
        return this.userAccountDao.updateLoyaltyPointAC(memberId, amounts);
    }

    insertOrderRecord(memberId, productId, cost, payBy){
        return this.orderDataDao.createOrderRecord(memberId, productId, cost, payBy)
    }

    async getAlbumSongs(albumId) {
        return await Promise.all([this.managementDao.getAlbum(albumId), this.managementDao.getSongListByAlbumId(albumId)]);
    }

    async handleCheckout (req, res){
        const cartArray = JSON.parse(req.body.cartArray);
        const memberId = req.session.memberId;
        const amounts = req.body.amounts;
        const payBy = req.body.payBy;
        if(cartArray.length>0 && payBy==="CR"){
            for(let i in cartArray){
                const lp = cartArray[i].price * 0.2;
                this.insertOrderRecord(memberId, cartArray[i].productId, cartArray[i].price, payBy);
                this.updateLoyaltyPoint(memberId, lp);
            }
              this.updateUserCredit(memberId, amounts);
           }else if(cartArray.length>0 && payBy==="LP"){
            for(let i in cartArray) {
                this.insertOrderRecord(memberId, cartArray[i].productId, cartArray[i].price, payBy);
            }
            this.updateLoyaltyPointAC(memberId, amounts);
        }


    }
}

module.exports = CartController;
