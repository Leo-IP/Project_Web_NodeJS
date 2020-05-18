'use strict';
const MysqlAdapter = require('../adapters/MysqlAdapter');
const {AlbumData, AlbumDataConst} = require('./dataStructures/AlbumData');
const {SongDataConst} = require('./dataStructures/SongData');
const {OrderDataConst} = require('./dataStructures/OrderData');
const {RefundDataConst} = require('./dataStructures/RefundData');

class StoreDao extends MysqlAdapter {
    constructor(option) {
        super(option);
    }

    async getAlbum(albumId) {
        const {results} = await this.query({
            sql: `SELECT ${AlbumDataConst.SQLSelectAll} FROM ${AlbumDataConst.tableName} WHERE ${AlbumDataConst.AlbumId}=? AND ${AlbumDataConst.Flag}='A'`,
            values: [albumId]
        });

        console.log(results);
        return results.length > 0 && results[0];
    }

    async getAlbumProductId(albumId) {
        const {results} = await this.query({
            sql: `SELECT ${AlbumDataConst.ProductId} FROM ${AlbumDataConst.tableName} WHERE ${AlbumDataConst.AlbumId}=? AND ${AlbumDataConst.Flag}='A'`,
            values: [albumId]
        });
        return results.length > 0 && results[0][AlbumDataConst.ProductId];
    }

    async getSongProductIdListByAlbumId(albumId) {
        const {results} = await this.query({
            sql: `SELECT st.${SongDataConst.ProductId} FROM ${SongDataConst.tableName} st, ${AlbumDataConst.tableName} at ` +
                `WHERE st.${SongDataConst.AlbumId}=? AND st.${SongDataConst.AlbumId}=at.${AlbumDataConst.AlbumId} AND at.${AlbumDataConst.Flag}='A' AND st.${SongDataConst.Flag}='A'`,
            values: [albumId]
        });
        console.log(results);
        return results;
    }

    async getAlbumCount() {
        const {results} = await this.query({
            sql: `SELECT COUNT(${AlbumDataConst.AlbumId}) as count FROM ${AlbumDataConst.tableName} WHERE ${AlbumDataConst.Flag}='A'`
        });
        console.log(results);
        return results[0].count;
    }

    async getAlbumList(page) {
        const {results} = await this.query({
            sql: `SELECT ${AlbumDataConst.SQLSelectAll} FROM ${AlbumDataConst.tableName} WHERE ${AlbumDataConst.Flag}='A' LIMIT 30`
        });
        console.log(results);
        return results;
    }

    async getSongListByAlbumId(albumId) {
        const {results} = await this.query({
            sql: `SELECT ${SongDataConst.SQLSelectAll('st')} FROM ${SongDataConst.tableName} st, ${AlbumDataConst.tableName} at ` +
                `WHERE st.${SongDataConst.AlbumId}=? AND st.${SongDataConst.AlbumId}=at.${AlbumDataConst.AlbumId} AND at.${AlbumDataConst.Flag}='A' AND st.${SongDataConst.Flag}='A'`,
            values: [albumId]
        });
        console.log(results);
        return results;
    }

    async checkTrialSongFile(filename) {
        const {results} = await this.query({
            sql: `SELECT st.${SongDataConst.TrialVerFile} FROM ${SongDataConst.tableName} st, ${AlbumDataConst.tableName} at ` +
                `WHERE st.${SongDataConst.TrialVerFile}=? AND st.${SongDataConst.AlbumId}=at.${AlbumDataConst.AlbumId} AND at.${AlbumDataConst.Flag}='A' AND st.${SongDataConst.Flag}='A'`,
            values: [filename]
        });
        console.log(results);
        return results.length > 0 && results[0][SongDataConst.TrialVerFile];
    }

    async checkUserBoughtAlbum(memberId, productId) {
        const {results} = await this.query({
            sql: `SELECT ${OrderDataConst.OrderId} FROM ${OrderDataConst.tableName} ` +
                `WHERE ${OrderDataConst.MemberId}=? AND ${OrderDataConst.ProductId}=? AND ` +
                `NOT EXISTS (SELECT rt.${RefundDataConst.RefundId} FROM ${RefundDataConst.tableName} rt, ${OrderDataConst.tableName} ot ` +
                `WHERE rt.${RefundDataConst.MemberId}=? AND ot.${OrderDataConst.ProductId}=? AND rt.${RefundDataConst.OrderId}=ot.${OrderDataConst.OrderId} AND rt.${RefundDataConst.Approved}=1)`,
            values: [memberId, productId, memberId, productId]
        });
        console.log(results);
        return results.length > 0;
    }

    async checkUserBoughtSongList(memberId, songPIds) {
        const {results} = await this.query({
            sql: `SELECT ot.${OrderDataConst.ProductId} FROM ${OrderDataConst.tableName} ot ` +
                `WHERE ot.${OrderDataConst.MemberId}=? AND ot.${OrderDataConst.ProductId} IN (${songPIds.toString()})`,
            values: [memberId]
        });
        console.log(results);
        return results;
    }

    async getSongFilenameForDownload(albumPId, songPIds) {
        const {results} = await this.query({
            sql: `SELECT st.${SongDataConst.FullVerFile}, st.${SongDataConst.Name} FROM ${SongDataConst.tableName} st, ${AlbumDataConst.tableName} at ` +
                `WHERE at.${AlbumDataConst.ProductId}=? AND st.${SongDataConst.ProductId}=? AND at.${AlbumDataConst.AlbumId}=st.${SongDataConst.AlbumId} AND at.${AlbumDataConst.Flag}='A' AND st.${SongDataConst.Flag}='A'`,
            values: [albumPId, songPIds]
        });
        console.log(results);
        return results.length > 0 && results[0];
    }
}


module.exports = StoreDao;