'use strict';

class RefundData {
    constructor({RefundId = null, MemberId = null, AlbumId = null, OrderId = null, AddDate = null, Approved = null}) {
        this.RefundId = RefundId;
        this.MemberId = MemberId;
        this.OrderId = OrderId;
        this.AddDate = AddDate;
        this.Approved = Approved;
    }
}

module.exports.RefundDataConst = {
    RefundId: 'RefundId',
    MemberId: 'MemberId',
    OrderId: 'OrderId',
    Approved: 'Approved',
    AddDate: 'AddDate',
    ModifyDate: 'ModifyDate',
    SQLSelectAll: 'RefundId, MemberId, OrderId, AddDate, Approved',
    SQLInsertAll: 'MemberId, OrderId, Approved, AddDate, ModifyDate',
    tableName: 'musicstoredb.refundrequests'
};

module.exports.RefundData = RefundData;