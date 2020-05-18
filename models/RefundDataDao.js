'use strict';
const MysqlAdapter = require('../adapters/MysqlAdapter');
const {RefundData, RefundDataConst} = require('./dataStructures/RefundData');

class RefundDataDao extends MysqlAdapter{
    constructor(option){
        super(option);
    }

    async createRefundRecord(memberId, orderId, approved){

        const {results} = await this.query({
            sql: `INSERT INTO ${RefundDataConst.tableName} (${RefundDataConst.SQLInsertAll}) VALUES(?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            values: [memberId, orderId, approved]
        });

        console.log(results);
        return results;
    }
}

module.exports = RefundDataDao;