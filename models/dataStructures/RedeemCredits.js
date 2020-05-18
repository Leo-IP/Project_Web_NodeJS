'use strict';

class RedeemCredits {
    constructor({RedeemId = null, CreditId = null, MemberId = null, AddDate = null}) {
        this.RedeemId = RedeemId;
        this.CreditId= CreditId;
        this.MemberId = MemberId;
        this.AddDate = AddDate;
    }
}

module.exports.RedeemCreditsConst = {
    RedeemId: 'RedeemId',
    CreditId: 'CreditId',
    MemberId: 'MemberId',
    AddDate: 'AddDate',
    SQLSelectAll: 'RedeemId, CreditId, MemberId, AddDate',
    SQLInsertAll: 'CreditId, MemberId, AddDate',
    tableName: 'musicstoredb.redeemrecords'
};

module.exports.RedeemCredits = RedeemCredits;