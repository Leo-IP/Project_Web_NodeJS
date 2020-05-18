'use strict';
const StoreDao = require('./StoreDao');
const {AlbumData, AlbumDataConst} = require('./dataStructures/AlbumData');
const {CreditData, CreditDataConst} = require('./dataStructures/CreditData');
const {SongData, SongDataConst} = require('./dataStructures/SongData');
const {OrderDataConst} = require('./dataStructures/OrderData');
const {RefundDataConst} = require('./dataStructures/RefundData');

class ManagementDao extends StoreDao {
    constructor(option) {
        super(option);
    }

    async getTotalOrderCount() {
        const {results} = await this.query({
            sql: `SELECT COUNT(${OrderDataConst.OrderId}) AS count FROM ${OrderDataConst.tableName}`
        });
        console.log(results);
        return results[0].count;
    }

    async getTotalRefundCount() {
        const {results} = await this.query({
            sql: `SELECT COUNT(${RefundDataConst.RefundId}) AS count FROM ${RefundDataConst.tableName}`
        });
        console.log(results);
        return results[0].count;
    }

    async getLast7DayOrderCount() {
        const {results} = await this.query({
            sql: `SELECT COUNT(${OrderDataConst.OrderId}) AS count, DATE_FORMAT(${OrderDataConst.AddDate}, '%Y-%m-%d') AS yyyymmdd, ${OrderDataConst.PayBy} FROM ${OrderDataConst.tableName} ` +
                `WHERE ${OrderDataConst.AddDate}>DATE_ADD(CURDATE(),INTERVAL -8 DAY) ` +
                `GROUP BY DATE_FORMAT(${OrderDataConst.AddDate}, '%Y-%m-%d'), ${OrderDataConst.PayBy}`
        });
        console.log(results);
        return results;
    }

    async getLast7DayRefundCount() {
        const {results} = await this.query({
            sql: `SELECT COUNT(${RefundDataConst.RefundId}) AS count, DATE_FORMAT(${RefundDataConst.AddDate}, '%Y-%m-%d') AS yyyymmdd, ${RefundDataConst.Approved} FROM ${RefundDataConst.tableName} ` +
                `WHERE ${RefundDataConst.AddDate}>DATE_ADD(CURDATE(),INTERVAL -8 DAY) ` +
                `GROUP BY DATE_FORMAT(${RefundDataConst.AddDate}, '%Y-%m-%d'), ${RefundDataConst.Approved}`
        });
        console.log(results);
        return results;
    }

    async insertNewCreditCode(code, Amounts) {
        const {results} = await this.query({
            sql: `INSERT INTO ${CreditDataConst.tableName} (${CreditDataConst.Code}, ${CreditDataConst.Amounts}, ${CreditDataConst.Flag}) ` +
                "VALUES (?, ?, 'A')",
            values: [code, Amounts]
        });
        console.log(results);
        return results.insertId;
    }

    async getCreditCodeCount() {
        const {results} = await this.query({
            sql: `SELECT COUNT(${CreditDataConst.CreditId}) as count FROM ${CreditDataConst.tableName} WHERE ${CreditDataConst.Flag}='A'`
        });
        console.log(results);
        return results[0].count;
    }

    async getCreditCodeList(page) {
        const {results} = await this.query({
            sql: `SELECT ${CreditDataConst.SQLSelectAll} FROM ${CreditDataConst.tableName} WHERE ${CreditDataConst.Flag}='A' LIMIT 30`
        });
        console.log(results);
        return results;
    }

    /*May need to consider better DB design to handle two table insertion within one TRANSACTION;
    using START TRANSACTION / using stored procedure;
    https://stackoverflow.com/questions/3837990/last-insert-id-mysql
    https://stackoverflow.com/questions/47809269/node-js-mysql-pool-begintransaction-connection
    */
    async insertProduct(productType) {
        const {results} = await this.query({
            sql: 'INSERT INTO products (ProductType) VALUES (?)',
            values: [productType]
        });

        console.log(results);
        return results.insertId;
    }

    async insertNewAlbum(name, description, artist, quantity, coverImage, priceOverride) {
        const productId = await this.insertProduct('A');
        const {results} = await this.query({
            sql: `INSERT INTO ${AlbumDataConst.tableName} (ProductId, ${AlbumDataConst.Name}, ${AlbumDataConst.Description}, ${AlbumDataConst.Artist}, ${AlbumDataConst.Quantity}, ${AlbumDataConst.CoverImageFile}, ${AlbumDataConst.PriceOverride}, ${AlbumDataConst.Flag}) ` +
                "VALUES (?, ?, ?, ?, ?, ?, ?, 'A')",
            values: [productId, name, description, artist, quantity, coverImage, priceOverride]
        });
        console.log(results);
        return results;
    }

    async updateAlbum(albumId, name, description, artist, quantity, coverImage, priceOverride) {
        const updatefields = [];
        const vals = [];
        if (name) {
            updatefields.push(AlbumDataConst.Name + '=?');
            vals.push(name);
        }
        if (description) {
            updatefields.push(AlbumDataConst.Description + '=?');
            vals.push(description);
        }
        if (artist) {
            updatefields.push(AlbumDataConst.Artist + '=?');
            vals.push(artist);
        }
        if (quantity) {
            updatefields.push(AlbumDataConst.Quantity + '=?');
            vals.push(quantity);
        }
        if (coverImage) {
            updatefields.push(AlbumDataConst.CoverImageFile + '=?');
            vals.push(coverImage);
        }
        if (priceOverride) {
            updatefields.push(AlbumDataConst.PriceOverride + '=?');
            vals.push(priceOverride);
        }
        vals.push(albumId);

        const {results} = await this.query({
            sql: `UPDATE ${AlbumDataConst.tableName} SET ${updatefields.join(', ')} WHERE ${AlbumDataConst.AlbumId}=?`,
            values: vals
        });

        console.log(results);
        return results;
    }

    async insertNewSong(albumId, name, price, quantity, trialVerFile, fullVerFile) {
        const productId = await this.insertProduct('S');
        const {results} = await this.query({
            sql: `INSERT INTO ${SongDataConst.tableName} (ProductId, ${SongDataConst.AlbumId}, ${SongDataConst.Name}, ${SongDataConst.Price}, ${SongDataConst.Quantity}, ${SongDataConst.TrialVerFile}, ${SongDataConst.FullVerFile}, ${AlbumDataConst.Flag}) ` +
                "VALUES (?, ?, ?, ?, ?, ?, ?, 'A')",
            values: [productId, albumId, name, price, quantity, trialVerFile, fullVerFile]
        });
        console.log(results);
        return results;
    }

    async updateSong(songId, name, price, quantity, trialVerFile, fullVerFile) {
        const updatefields = [];
        const vals = [];
        if (name) {
            updatefields.push(SongDataConst.Name + '=?');
            vals.push(name);
        }
        if (price) {
            updatefields.push(SongDataConst.Price + '=?');
            vals.push(price);
        }
        if (quantity) {
            updatefields.push(SongDataConst.Quantity + '=?');
            vals.push(quantity);
        }
        if (trialVerFile) {
            updatefields.push(SongDataConst.TrialVerFile + '=?');
            vals.push(trialVerFile);
        }
        if (fullVerFile) {
            updatefields.push(SongDataConst.FullVerFile + '=?');
            vals.push(fullVerFile);
        }
        vals.push(songId);

        const {results} = await this.query({
            sql: `UPDATE ${SongDataConst.tableName} SET ${updatefields.join(', ')} WHERE ${SongDataConst.SongId}=?`,
            values: vals
        });

        console.log(results);
        return results;
    }

    async deactAlbum(albumId) {
        const {results} = await this.query({
            sql: `UPDATE ${AlbumDataConst.tableName} SET ${AlbumDataConst.Flag}='D' WHERE ${AlbumDataConst.AlbumId}=?`,
            values: [albumId]
        });
        console.log(results);
        return results;
    }

    async deactSong(songId) {
        const {results} = await this.query({
            sql: `UPDATE ${SongDataConst.tableName} SET ${SongDataConst.Flag}='D' WHERE ${SongDataConst.SongId}=?`,
            values: [songId]
        });
        console.log(results);
        return results;
    }

    async deactCredit(creditId) {
        const {results} = await this.query({
            sql: `UPDATE ${CreditDataConst.tableName} SET ${CreditDataConst.Flag}='D' WHERE ${CreditDataConst.CreditId}=?`,
            values: [creditId]
        });
        console.log(results);
        return results;
    }

    async checkAdminLogin(username, password) {
        const {results} = await this.query({
            sql: `SELECT Username FROM adminaccounts WHERE Username=? AND Password=MD5(?) AND Flag='A'`,
            values: [username, password]
        });
        console.log(results);
        return results.length > 0 && results[0];
    }
}


module.exports = ManagementDao;