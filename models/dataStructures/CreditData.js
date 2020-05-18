'use strict';

class CreditData {
    constructor({CreditId = null, Code = null, Amounts = null, AddDate = null, ModifyDate = null, Flag = null}) {
        this.CreditId = CreditId;
        this.Code = Code;
        this.Amounts = Amounts;
        this.AddDate = AddDate;
        this.ModifyDate = ModifyDate;
        this.Flag = Flag;
    }
}

module.exports.CreditDataConst = {
    CreditId: 'CreditId',
    Code: 'Code',
    Amounts: 'Amounts',
    AddDate: 'AddDate',
    ModifyDate: 'ModifyDate',
    Flag: 'Flag',
    SQLSelectAll: 'CreditId, Code, Amounts, AddDate',
    tableName: 'creditcodes'
};

module.exports.CreditData = CreditData;