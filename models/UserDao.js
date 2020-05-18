'use strict';
const MysqlAdapter = require('../adapters/MysqlAdapter');
const {UserAccount, UserAccountConst} = require('./dataStructures/UserAccount');
const {OrderData, OrderDataConst} = require('./dataStructures/OrderData');
const {AlbumData, AlbumDataConst} = require('./dataStructures/AlbumData');
const {SongData, SongDataConst} = require('./dataStructures/SongData');
const {ProductData, ProductDataConst} = require('./dataStructures/ProductData');

class UserDao extends MysqlAdapter {
    constructor(option) {
        super(option);
    }

    async login(email, password) {
        const {results} = await this.query({
            sql: `SELECT ${UserAccountConst.MemberId} FROM members WHERE ${UserAccountConst.Email} = ? AND ${UserAccountConst.Password} = ? AND ${UserAccountConst.Flag}='A'`,
            values: [email, password]
        });

        console.log(results);
        return results.length > 0 && results;
    }

    async getUserAccount(memberId) {
        const {results} = await this.query({
            sql: `SELECT ${UserAccountConst.SQLSelectAll} FROM members WHERE ${UserAccountConst.MemberId} = ?`,
            values: [memberId]
        });

        console.log(results);
        return results.length > 0 && results;
    }

    async isUserExists(email){
        const {results} = await this.query({
            sql: `SELECT ${UserAccountConst.SQLSelectAll} FROM members WHERE ${UserAccountConst.Email} = ?`,
            values: [email]
        })

        console.log(results);
        return results;
    }

    async createUserAccount(email, password, firstName, lastName, birthday, phone){
        const {results} = await this.query({
            sql: `INSERT INTO ${UserAccountConst.tableName} (${UserAccountConst.SQLInsertAll}) VALUES (?, ?, ?, ?, ?, ?, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'A');`,
            values: [email, password, firstName, lastName, birthday, phone]
        });

        console.log(results)
        return results;
    }

    async updateUserCredit(memberId, amount){
        const {results} = await this.query({
            sql: `UPDATE ${UserAccountConst.tableName} SET ${UserAccountConst.Credits} = ${UserAccountConst.Credits} + ? WHERE ${UserAccountConst.MemberId} = ?`,
            values: [amount, memberId]
        });

        console.log(results)
        return results;
    }

    async updateUserCreditAC(memberId, amount){
        const {results} = await this.query({
            sql: `UPDATE ${UserAccountConst.tableName} SET ${UserAccountConst.Credits} = ? WHERE ${UserAccountConst.MemberId} = ?`,
            values: [amount, memberId]
        });

        console.log(results);
        return results;
    }

    async updateLoyaltyPointAC(memberId, amount){
        const {results} = await this.query({
            sql: `UPDATE ${UserAccountConst.tableName} SET ${UserAccountConst.LPoints} = ? WHERE ${UserAccountConst.MemberId} = ?`,
            values: [amount, memberId]
        });

        console.log(results)
        return results;
    }

    async updateLoyaltyPointRF(memberId, amount){
        const {results} = await this.query({
            sql: `UPDATE ${UserAccountConst.tableName} SET ${UserAccountConst.LPoints} = ${UserAccountConst.LPoints} - ? WHERE ${UserAccountConst.MemberId} = ?`,
            values: [amount, memberId]
        });

        console.log(results)
        return results;
    }


    async updateLoyaltyPoint(memberId, amount){
        const {results} = await this.query({
            sql: `UPDATE ${UserAccountConst.tableName} SET ${UserAccountConst.LPoints} = ${UserAccountConst.LPoints} + ? WHERE ${UserAccountConst.MemberId} = ?`,
            values: [amount, memberId]
        });

        console.log(results)
        return results;
    }

    async getUserAlbumOrderDetail(orderId, productId){
        const {results} = await this.query({
            sql: `SELECT o.${OrderDataConst.OrderId}, a.${AlbumDataConst.Name}, a.${AlbumDataConst.Artist}, a.${AlbumDataConst.Description}, 
                         o.${OrderDataConst.Cost}, p.${ProductDataConst.ProductType}, o.${OrderDataConst.PayBy}, o.${OrderDataConst.AddDate} 
                  FROM ${AlbumDataConst.tableName} AS a, ${ProductDataConst.tableName} AS p, ${OrderDataConst.tableName} AS o
                  WHERE o.${OrderDataConst.ProductId} = p.${ProductDataConst.ProductId} AND a.${AlbumDataConst.ProductId} = p.${ProductDataConst.ProductId} 
                  AND o.${ProductDataConst.ProductId} = ? AND o.${OrderDataConst.OrderId} = ?`,
            values: [productId, orderId]
        })

        // console.log(results)
        return results[0];
    }

    async getUserSongOrderDetail(orderId, productId){
        const {results} = await this.query({
            sql: `SELECT o.${OrderDataConst.OrderId}, s.${SongDataConst.Name}, a.${AlbumDataConst.Artist}, 
                         o.${OrderDataConst.Cost}, p.${ProductDataConst.ProductType}, o.${OrderDataConst.PayBy}, o.${OrderDataConst.AddDate} 
                  FROM ${AlbumDataConst.tableName} AS a, ${ProductDataConst.tableName} AS p, ${OrderDataConst.tableName} AS o, ${SongDataConst.tableName} AS s
                  WHERE o.${OrderDataConst.ProductId} = p.${ProductDataConst.ProductId} AND s.${SongDataConst.ProductId} = p.${ProductDataConst.ProductId} 
                  AND s.${SongDataConst.AlbumId} = a.${AlbumDataConst.AlbumId} AND o.${ProductDataConst.ProductId} = ? 
                  AND o.${OrderDataConst.OrderId} = ?`,
            values: [productId, orderId]
        })

        // console.log(results)
        return results[0];
    }
}

module.exports = UserDao;
