'use strict';
const mysql = require('mysql');

const {dbConfigs} = require('../config/config.json');

//// https://github.com/mysqljs/mysql

/**
 * The abstract class to access mysql
 */
class MysqlAdapter {
    constructor(configOverride) {
        this.pool = mysql.createPool(configOverride || dbConfigs.musicstoredb);
    }

    getConnection() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) return reject(err);
                resolve(connection);
            });
        });
    }

    /**
     * Please use following format for sqlOptions
     * {
     *   sql: 'SELECT * FROM `books` WHERE `author` = ?',
     *   timeout: 40000, // 40s
     *   values: ['David']
     * }
     * @param sqlOptions
     * @returns {Promise<any>}
     */
    query(sqlOptions) {
        return new Promise((resolve, reject) => {
            this.pool.query(sqlOptions, function (err, results, fields) {
                if (err) return reject(err);
                resolve({results, fields});
            });
        });
    }

    end() {
        return new Promise((resolve, reject) => {
            this.pool.end((err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

module.exports = MysqlAdapter;