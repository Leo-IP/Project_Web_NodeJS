'use strict';
const MysqlAdapter = require('../adapters/MysqlAdapter');
const {CreditData, CreditDataConst} = require('./dataStructures/CreditData');

class CreditDataDao extends MysqlAdapter{
    constructor(option){
        super(option);
    }

    async getCreditData(code){

        var flag = 'A';
        const {results} = await this.query({
            sql: `SELECT ${CreditDataConst.CreditId}, ${CreditDataConst.Amounts} FROM ${CreditDataConst.tableName} WHERE ${CreditDataConst.Code} = ? AND ${CreditDataConst.Flag} = ?`,
            values: [code, flag]
        });

        console.log(results);
        return results;
    }

    async deactCreditData(creditId){

        var flag = 'D';
        const {results} = await this.query({
            sql: `UPDATE ${CreditDataConst.tableName} SET Flag = ?, ModifyDate = CURRENT_TIMESTAMP WHERE CreditId = ?`,
            values:[flag, creditId]
        });

        console.log(results);
        return results;
    }
}

module.exports = CreditDataDao;