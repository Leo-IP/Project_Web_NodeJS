'use strict';
const crypto = require('crypto');
const path = require('path');
const moment = require('moment');
const ManagementDao = require('../models/ManagementDao');

class AdminController {
    constructor() {
        this.managementDao = new ManagementDao();
    }

    getCountForDashboard() {
        return Promise.all([
            this.managementDao.getAlbumCount(),
            this.managementDao.getCreditCodeCount(),
            this.managementDao.getTotalOrderCount(),
            this.managementDao.getTotalRefundCount()
        ]);
    }

    async getAggLast7DayOrderCount() {
        const last7DayOrderCount = await this.managementDao.getLast7DayOrderCount();
        const aggregated = {
            labels: [],
            total: [0, 0, 0, 0, 0, 0, 0],
            CR: [0, 0, 0, 0, 0, 0, 0],
            LP: [0, 0, 0, 0, 0, 0, 0]
        };
        for (let i = 6; i >= 0; i--) {
            const date = moment().subtract(i, 'days');
            const label = date.format('DD/MM');
            const foundDays = last7DayOrderCount.filter(item => item.yyyymmdd === date.format('YYYY-MM-DD'));
            foundDays.forEach((val) => {
                aggregated[val.PayBy][6 - i] = val.count;
                aggregated.total[6 - i] += val.count;
            });
            aggregated.labels.push(label);
        }
        console.log(aggregated);
        return aggregated;
    }

    async getAggLast7DayRefundCount() {
        const last7DayRefundCount = await this.managementDao.getLast7DayRefundCount();
        const aggregated = {
            labels: [],
            total: [0, 0, 0, 0, 0, 0, 0],
            "0": [0, 0, 0, 0, 0, 0, 0],
            "1": [0, 0, 0, 0, 0, 0, 0]
        };
        for (let i = 6; i >= 0; i--) {
            const date = moment().subtract(i, 'days');
            const label = date.format('DD/MM');
            const foundDays = last7DayRefundCount.filter(item => item.yyyymmdd === date.format('YYYY-MM-DD'));
            foundDays.forEach((val) => {
                aggregated[val.Approved][6 - i] = val.count;
                aggregated.total[6 - i] += val.count;
            });
            aggregated.labels.push(label);
        }
        console.log(aggregated);
        return aggregated;
    }

    async getStatistics(option) {
        if (option === 'refund') return this.getAggLast7DayRefundCount();
        return this.getAggLast7DayOrderCount();
    }

    getAlbumList() {
        return this.managementDao.getAlbumList();
    }

    getAlbum(albumId) {
        return this.managementDao.getAlbum(albumId);
    }

    getAlbumSongs(albumId) {
        return Promise.all([this.managementDao.getAlbum(albumId), this.managementDao.getSongListByAlbumId(albumId)]);
    }

    getCreditList() {
        return this.managementDao.getCreditCodeList();
    }

    async handleGenCredit(creditAmounts) {
        const code = crypto.randomBytes(16).toString('hex');
        const insertId = await this.managementDao.insertNewCreditCode(code, creditAmounts);
        return {creditId: insertId, creditCode: code, creditAmounts: creditAmounts};
    }

    async handleCreateAlbum(req) {
        const {name, description, artist, quantity, priceOverride} = req.body;
        const {insertId} = await this.managementDao.insertNewAlbum(name, description, artist, quantity, path.basename(req.file.path), priceOverride || 0);
        return insertId;
    }

    async handleEditAlbum(req) {
        const {albumId, name, description, artist, quantity, priceOverride} = req.body;
        await this.managementDao.updateAlbum(albumId, name, description, artist, quantity, req.file && path.basename(req.file.path), priceOverride || 0);
    }

    async handleAddSongs(req) {
        await this.managementDao.insertNewSong(req.body.albumId, req.body.name, req.body.price, req.body.quantity, path.basename(req.files['songTrialVer'][0].path), path.basename(req.files['songFullVer'][0].path));
    }

    async handleEditSong(req) {
        const trialVerFile = req.files['songTrialVer'] && path.basename(req.files['songTrialVer'][0].path);
        const fullVerFile = req.files['songFullVer'] && path.basename(req.files['songFullVer'][0].path);
        const {songId, name, price, quantity} = req.body;
        await this.managementDao.updateSong(songId, name, price, quantity, trialVerFile, fullVerFile);
    }

    async handleDelAlbum(albumId) {
        await this.managementDao.deactAlbum(albumId);
    }

    async handleDelSong(songId) {
        await this.managementDao.deactSong(songId);
    }

    async handleDelCredit(creditId) {
        await this.managementDao.deactCredit(creditId);
    }

    handleAdminLogin(username, password) {
        return this.managementDao.checkAdminLogin(username, password);
    }
}

module.exports = AdminController;