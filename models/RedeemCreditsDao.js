'use strict';
const MysqlAdapter = require('../adapters/MysqlAdapter');
const {RedeemCredits, RedeemCreditsConst} = require('./dataStructures/RedeemCredits');

class RedeemCreditsDao extends MysqlAdapter{
    constructor(option){
        super(option);
    }

    async createRedeemRecord(creditId, memberId){

        const {results} = await this.query({
            sql: `INSERT INTO ${RedeemCreditsConst.tableName} (${RedeemCreditsConst.SQLInsertAll}) VALUES(?, ?, CURRENT_TIMESTAMP)`,
            values: [creditId, memberId]
        });

        console.log(results);
        return results;
    }
}

module.exports = RedeemCreditsDao;