'use strict';

class OrderData {
    constructor({OrderId = null, MemberId = null, ProductId, Cost = null, PayBy = null, AddDate = null}) {
        // this.OrderId = OrderId;
        this.orderId = OrderId;
        this.MemberId = MemberId;
        this.ProductId = ProductId;
        this.Cost = Cost;
        this.PayBy = PayBy;
        this.AddDate = AddDate;
    }
}

module.exports.OrderDataConst = {
    OrderId: 'OrderId',
    MemberId: 'MemberId',
    ProductId: 'ProductId',
    Cost: 'Cost',
    PayBy: 'PayBy',
    AddDate: 'AddDate',
    SQLSelectAll: '*',
    SQLInsertAll: 'MemberId, ProductId, Cost, PayBy, AddDate',
    tableName: 'orders'
};

module.exports.OrderData = OrderData;
