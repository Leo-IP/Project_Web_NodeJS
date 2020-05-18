'use strict';
const path = require('path');
const moment = require('moment');
const StoreDao = require('../models/StoreDao');

class MusicStoreController {
    constructor() {
        this.StoreDao = new StoreDao();
    }

    getAlbumList() {
        return this.StoreDao.getAlbumList();
    }

    async getAlbumSongs(albumId) {
        const res = await Promise.all([this.StoreDao.getAlbum(albumId), this.StoreDao.getSongListByAlbumId(albumId)]);
        if (!res[0]) return res;
        res[0].AddDate = moment(res[0].AddDate).format('LL');
        return res;
    }

    async checkTrialSongFile(filename) {
        return this.StoreDao.checkTrialSongFile(filename);
    }

    async checkUserBoughtAlbum(memberId, albumPId) {
        // const albumPId = await this.StoreDao.getAlbumProductId(albumId);
        return albumPId && this.StoreDao.checkUserBoughtAlbum(memberId, albumPId);
    }

    checkUserBoughtSongs(memberId, songPIds) {
        // const songPIds = await this.StoreDao.getSongProductIdListByAlbumId(albumId).then((pList) => pList.map(item => item.ProductId));
        return this.StoreDao.checkUserBoughtSongList(memberId, songPIds).then((pList) => pList.map(item => item.ProductId));
    }

    async getFullSongCheckUserForDown(memberId, albumPId, songPId) {
        const isUserBoughtAlbum = await this.checkUserBoughtAlbum(memberId, albumPId);
        if (isUserBoughtAlbum) {
            return this.StoreDao.getSongFilenameForDownload(albumPId, songPId);
        } else {
            const userBoughtSong = await this.checkUserBoughtSongs(memberId, [songPId]);
            return userBoughtSong.length > 0 && this.StoreDao.getSongFilenameForDownload(albumPId, songPId);
        }
    }
}

module.exports = MusicStoreController;