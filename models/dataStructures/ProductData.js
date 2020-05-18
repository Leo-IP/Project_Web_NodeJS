'use strict';

class ProductData {
    constructor({ProductId = null, ProductType = null, AddDate = null}) {
        this.ProductId = ProductId;
        this.ProductType = ProductType;
        this.AddDate = AddDate;
    }
}

module.exports.ProductDataConst = {
    ProductId: 'ProductId',
    ProductType: 'ProductType',
    AddDate: 'AddDate',
    SQLSelectAll: '*',
    tableName: 'products'
};

module.exports.ProductData = ProductData;