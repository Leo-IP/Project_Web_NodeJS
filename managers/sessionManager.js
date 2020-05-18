'use strict';
const session = require('express-session');
const MysqlSessionStore = require('express-mysql-session')(session);

const MysqlAdapter = require('../adapters/MysqlAdapter');

module.exports = () => {
    const mysqlAdapter = new MysqlAdapter();
    return new MysqlSessionStore({}, mysqlAdapter.pool);
};