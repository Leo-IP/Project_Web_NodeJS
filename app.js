'use strict';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const log4js = require("log4js");
const cors = require('cors');
const session = require('express-session');


const app = express();


/**
 * Log4js setup
 */
// region log4js setup
log4js.configure({
    pm2: false,
    appenders: {
        console: {type: 'console'},
        unhandledEx: {
            type: 'dateFile',
            filename: __dirname + '/log/unhandledException/unhandledEx',
            pattern: '-yyyyMMdd.log',
            alwaysIncludePattern: true,
            backups: 100
        }
    },
    categories: {
        default: {appenders: ['console'], level: 'info'},
        unhandledEx: {appenders: ['unhandledEx', 'console'], level: 'error'}
    }
});
const unhandledExLogger = log4js.getLogger("unhandledEx");
//log Promise unhandledRejection
process.on('unhandledRejection', (reason, p) => {
    unhandledExLogger.error(p);
});
// endregion


/**
 * Express setup
 * You should consider the config setup order.
 * Wrong setup order may produce unexpected result.
 */
// region basic setup
// Set running environment
app.set("env", process.env.NODE_ENV === 'production' ? 'prod' : 'dev');

// Use web security
app.use(helmet());

// Use logger for access log
app.use(morgan('dev'));

// Use bodyParser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Use cookieParser
app.use(cookieParser());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

const sessionStore = require('./managers/sessionManager')();
app.use(session({
    key: 'session_music',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

app.all('/', (req, res) => {
    res.redirect('/store/');
});
// Use public static folder
app.use(express.static(path.join(__dirname, 'public')));

// CORS config, use cors middleware module
// https://github.com/expressjs/cors/issues/118
const whitelist = ['http://localhost:3000'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders: ["Content-Type", "api_key"]
};

// endregion


/**
 * Custom route setup
 */
const musicStoreRoutes = require("./routes/musicStore");
app.use("/store", musicStoreRoutes);
const userRoutes = require("./routes/user");
app.use("/user", userRoutes);
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);


/**
 * Swagger doc setup
 */
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerJson = swaggerJSDoc({
    swaggerDefinition: {
        basePath: '/',
        info: {
            title: 'Node Music Store',
            version: '1.0.0',
            description: 'Routes definition for Music Store'
        },
        securityDefinitions: {
            // "api_key": {
            //     "type": "apiKey",
            //     "name": "api_key",
            //     "in": "header"
            // }
        }
    },
    apis: [__dirname + '/routes/*.js']
});

app.get('/mydesign/swagger/swagger.json', function (req, res) {
    res.json(swaggerJson);
});


/**
 * Error handler
 */
// region error handler setup
// catch 404 and forward to error handler
function error404(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
}

app.use(error404);

if (app.get('env') === 'dev') {
    // development error handler
    // will print stacktrace
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        // unhandledExLogger.error(err);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else if (app.get('env') === 'prod') {
    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.statusCode !== 404 && unhandledExLogger.error(err);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}
// endregion

module.exports = app;