'use strict';
const MysqlAdapter = require('../adapters/MysqlAdapter');
const {OrderData, OrderDataConst} = require('./dataStructures/OrderData');
const {RefundData, RefundDataConst} = require('./dataStructures/RefundData');
const {ProductData, ProductDataConst} = require('./dataStructures/ProductData');

class OrderDataDao extends MysqlAdapter{
    constructor(option){
        super(option);
    }

    async createOrderRecord(memberId, productId, cost, payBy){
           const {results} = await this.query({
            sql: `INSERT INTO ${OrderDataConst.tableName} (${OrderDataConst.SQLInsertAll}) VALUES(?, ?, ?, ?,CURRENT_TIMESTAMP)`,
            values: [memberId, productId, cost, payBy]
        });

        console.log(results);
        return results;
    }

    async getUserAllOrderRecord(memberId){
        var approved = 1;

        const {results} = await this.query({
            sql: `SELECT o.OrderId, p.ProductId, p.ProductType 
                  FROM ${OrderDataConst.tableName} AS o, ${ProductDataConst.tableName} AS p
                  WHERE orderId NOT IN 
                  (
                  SELECT orderId
                  FROM ${RefundDataConst.tableName}
                  WHERE Approved = ?
                  AND MemberId = ?
                  )
                  AND MemberId = ? AND p.ProductId = o.ProductId`,
            values: [approved, memberId, memberId]
        })

        console.log(results);
        return results;
    }

    async getUserOrderRecord(orderId){

        const {results} = await this.query({
            sql: `SELECT o.${OrderDataConst.PayBy}, o.${OrderDataConst.Cost}, p.${ProductDataConst.ProductType}, o.${OrderDataConst.AddDate}
                  FROM ${OrderDataConst.tableName} AS o, ${ProductDataConst.tableName} AS p 
                  WHERE o.${OrderDataConst.ProductId} = p.${ProductDataConst.ProductId} 
                  AND orderId = ?`,
            values: [orderId]
        })

        console.log(results);
        return results;
    }
}

module.exports = OrderDataDao;
