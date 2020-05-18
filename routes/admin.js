'use strict';
const path = require('path');
const multer = require('multer');
const {body, query, oneOf} = require('express-validator/check');
const express = require('express');
const validationReqFilter = require('../middlewares/validationReqFilter');
const AdminController = require('../controllers/AdminController');
const ResultOk = require('../jsonFormats/responses/ResultOk');
const ErrorJson = require('../jsonFormats/responses/ErrorJson');

const router = express.Router();
const coverImgMulter = multer({dest: path.join(__dirname, '/../files/covers/')}).single('coverImage');
const songsMulter = multer({dest: path.join(__dirname, '/../files/songs/')}).fields([
    {name: 'songTrialVer', maxCount: 1},
    {name: 'songFullVer', maxCount: 1}
]);
const adminController = new AdminController();

function adminSessionCheck(req, res, next) {
    if (req.session.admin) return next();
    res.status(403).json(ErrorJson('Restricted'));
}

function adminSessionCheckRender(req, res, next) {
    if (req.session.admin) return next();
    res.redirect('/admin/login-page');
}

/** EJS render routes **/
router.get("/err", (req, res) => {
    res.render("admin/404");
});

router.get("/login-page", (req, res) => {
    res.render("admin/login");
});

router.get("/", adminSessionCheckRender, async (req, res, next) => {
    try {
        const [albumCount, creditCount, orderCount, refundCount] = await adminController.getCountForDashboard();
        res.render("admin/layout", {page: 'index', albumCount, creditCount, orderCount, refundCount});
    } catch (e) {
        next(e);
    }
});

router.get("/order-report", adminSessionCheckRender, (req, res) => {
    res.render("admin/layout", {page: 'orderReport'});
});

router.get("/refund-report", adminSessionCheckRender, (req, res) => {
    res.render("admin/layout", {page: 'refundReport'});
});

router.get("/credits", adminSessionCheckRender, async (req, res, next) => {
    try {
        const creditList = await adminController.getCreditList();
        res.render("admin/layout", {page: 'credits', creditList});
    } catch (e) {
        next(e);
    }
});

router.get("/tables", adminSessionCheckRender, async (req, res, next) => {
    try {
        const alist = await adminController.getAlbumList();
        res.render("admin/layout", {page: 'tables', albumItems: alist});
    } catch (e) {
        next(e);
    }
});

router.get("/new-album-page", adminSessionCheckRender, (req, res) => {
    res.render("admin/layout", {page: 'newAlbum'});
});

router.get("/edit-album-page", adminSessionCheckRender, async (req, res, next) => {
    try {
        const albumInfo = await adminController.getAlbum(req.query.albumid);
        res.render("admin/layout", {page: 'editAlbum', albumInfo});
    } catch (e) {
        next(e);
    }
});

router.get("/edit-songs-page", adminSessionCheckRender, async (req, res, next) => {
    try {
        const [albumInfo, songList] = await adminController.getAlbumSongs(req.query.albumid);
        res.render("admin/layout", {page: 'editAlbumSongs', albumId: req.query.albumid, albumInfo, songList});
    } catch (e) {
        next(e);
    }
});
/** EJS render routes **/

/** Send song for admin **/
router.get('/song-file/:name', adminSessionCheck, (req, res) => {
    res.set({
        "Content-Type": "audio/mpeg",
    });
    res.sendFile(path.join(__dirname, '../files/songs/' + req.params.name));
});
/** Send song for admin **/

/**
 * @swagger
 * tags:
 *   name: Administrator
 *   description: Administrator
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - Administrator
 *     description: For admin login only.
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: username
 *       description: Admin username.
 *       in: formData
 *       required: true
 *       type: string
 *     - name: password
 *       description: Admin password.
 *       in: formData
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Success!
 */
router.post("/login", [
    body('username').exists(),
    body('password').exists()
], validationReqFilter, (req, res, next) => {
    //admin1122, azsxdc123
    adminController.handleAdminLogin(req.body.username, req.body.password)
        .then((r) => {
            if (!r) return res.json(ErrorJson('Incorrect username or password'));
            req.session.admin = r.Username;
            if (req.headers.referer && req.headers.referer.indexOf('admin/login-page') !== -1)
                return res.redirect('/admin/');
            res.json(ResultOk());
        }).catch(next);
});

/**
 * @swagger
 * /admin/logout:
 *   get:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - Administrator
 *     description: For admin logout only.
 *     produces:
 *     - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: Success!
 */
router.get("/logout", (req, res, next) => {
    req.session.destroy();
    if (req.headers.referer && req.headers.referer.indexOf('/admin') !== -1)
        return res.redirect('/admin/login-page');
    res.json(ResultOk());
});

//// forces following routes require admin session
router.use(adminSessionCheck);

/**
 * @swagger
 * /admin/statistics:
 *   get:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - Administrator
 *     description: Get the sell statistics.
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: option
 *       description: Enter "refund" to show statistics for refunds.
 *       in: query
 *       required: false
 *       type: integer
 *     responses:
 *       200:
 *         description: Success!
 */
router.get("/statistics", (req, res, next) => {
    adminController.getStatistics(req.query.option)
        .then(r => res.json(r)).catch(next);
});

/**
 * @swagger
 * /admin/generate-credits:
 *   post:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - Administrator
 *     description: Generate credits code for user to redeem credits.
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: creditAmounts
 *       description: How many credits can be redeemed from this code.
 *       in: formData
 *       required: true
 *       type: integer
 *     responses:
 *       200:
 *         description: Success!
 */
router.post("/generate-credits", body('creditAmounts').isInt(), validationReqFilter, (req, res, next) => {
    adminController.handleGenCredit(req.body.creditAmounts)
        .then((data) => {
            if (req.headers.referer && req.headers.referer.indexOf('admin/credits') !== -1)
                return res.redirect('back');
            res.json(data);
        }).catch(next);
});

/**
 * @swagger
 * /admin/create-album:
 *   post:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - Administrator
 *     description: Create a new album record in the system.
 *     consumes:
 *     - multipart/form-data
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: name
 *       description: The name of the album.
 *       in: formData
 *       required: true
 *       type: string
 *     - name: description
 *       description: The description of the album.
 *       in: formData
 *       required: true
 *       type: string
 *     - name: artist
 *       description: The artist name of the album.
 *       in: formData
 *       required: true
 *       type: string
 *     - name: quantity
 *       description: The quantity of the album.
 *       in: formData
 *       required: true
 *       type: integer
 *     - name: coverImage
 *       description: The cover of the album.
 *       in: formData
 *       required: true
 *       type: file
 *     - name: priceOverride
 *       description: Override the price of the album.
 *       in: formData
 *       required: false
 *       type: integer
 *     responses:
 *       200:
 *         description: Success!
 */
router.post("/create-album", coverImgMulter, [
    body('name').exists(),
    body('description').exists(),
    body('artist').exists(),
    body('quantity').isInt(),
    (req, res, next) => req.body.priceOverride && body('priceOverride').isInt()(req, res, next) || next(),
], validationReqFilter, (req, res, next) => {
    adminController.handleCreateAlbum(req, res)
        .then((insertId) => {
            if (req.headers.referer && req.headers.referer.indexOf('admin/new-album-page') !== -1)
                return res.redirect('/admin/edit-songs-page?albumid=' + insertId);
            res.json(ResultOk());
        }).catch(next);
});

/**
 * @swagger
 * /admin/add-song:
 *   post:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - Administrator
 *     description: Create a song record in the system.
 *     consumes:
 *     - multipart/form-data
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: albumId
 *       description: Which albumId for this song binding to.
 *       in: formData
 *       required: true
 *       type: string
 *     - name: name
 *       description: The name of the song.
 *       in: formData
 *       required: true
 *       type: string
 *     - name: price
 *       description: The price of the song.
 *       in: formData
 *       required: true
 *       type: string
 *     - name: quantity
 *       description: The quantity of the song.
 *       in: formData
 *       required: true
 *       type: integer
 *     - name: songTrialVer
 *       description: Upload the song file (trial version).
 *       in: formData
 *       required: true
 *       type: file
 *     - name: songFullVer
 *       description: Upload the song file (full version).
 *       in: formData
 *       required: true
 *       type: file
 *     responses:
 *       200:
 *         description: Success!
 */
router.post("/add-song", songsMulter, [
    body('albumId').isInt(),
    body('name').exists(),
    body('price').isInt(),
    body('quantity').isInt()
], validationReqFilter, (req, res, next) => {
    adminController.handleAddSongs(req, res)
        .then(() => res.json(ResultOk())).catch(next);
});

/**
 * @swagger
 * /admin/edit-album:
 *   put:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - Administrator
 *     description: Edit (update) the existing album record in the system.
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: albumId
 *       description: The albumId of existing album.
 *       in: formData
 *       required: true
 *       type: string
 *     - name: name
 *       description: The name of the album.
 *       in: formData
 *       required: false
 *       type: string
 *     - name: description
 *       description: The description of the album.
 *       in: formData
 *       required: false
 *       type: string
 *     - name: artist
 *       description: The artist name of the album.
 *       in: formData
 *       required: false
 *       type: string
 *     - name: quantity
 *       description: The quantity of the album.
 *       in: formData
 *       required: false
 *       type: integer
 *     - name: coverImage
 *       description: The cover of the album.
 *       in: formData
 *       required: false
 *       type: file
 *     - name: priceOverride
 *       description: Override the price of the album.
 *       in: formData
 *       required: false
 *       type: integer
 *     responses:
 *       200:
 *         description: Success!
 */
router.put("/edit-album", coverImgMulter, [
    body('albumId').isInt(),
    (req, res, next) => req.body.quantity && body('quantity').isInt()(req, res, next) || next(),
    (req, res, next) => req.body.priceOverride && body('priceOverride').isInt()(req, res, next) || next(),
], validationReqFilter, (req, res, next) => {
    adminController.handleEditAlbum(req, res)
        .then(() => res.json(ResultOk()))
        .catch(next);
});
////for html form using post
router.post("/edit-album", coverImgMulter, [
    body('albumId').isInt(),
    (req, res, next) => req.body.quantity && body('quantity').isInt()(req, res, next) || next(),
    (req, res, next) => req.body.priceOverride && body('priceOverride').isInt()(req, res, next) || next(),
], validationReqFilter, (req, res, next) => {
    adminController.handleEditAlbum(req, res)
        .then(() => {
            if (req.headers.referer && req.headers.referer.indexOf('admin/edit-album-page') !== -1)
                return res.redirect('/admin/tables');
            res.json(ResultOk());
        }).catch(next);
});

/**
 * @swagger
 * /admin/edit-song:
 *   put:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - Administrator
 *     description: Edit (update) the existing album record in the system.
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: songId
 *       description: The songId of existing song.
 *       in: formData
 *       required: true
 *       type: string
 *     - name: name
 *       description: The name of the song.
 *       in: formData
 *       required: false
 *       type: string
 *     - name: price
 *       description: The price of the song.
 *       in: formData
 *       required: false
 *       type: integer
 *     - name: quantity
 *       description: The quantity of the song.
 *       in: formData
 *       required: false
 *       type: integer
 *     - name: songTrialVer
 *       description: Upload the song file (trial version).
 *       in: formData
 *       required: false
 *       type: file
 *     - name: songFullVer
 *       description: Upload the song file (full version).
 *       in: formData
 *       required: false
 *       type: file
 *     responses:
 *       200:
 *         description: Success!
 */
router.put("/edit-song", songsMulter, body('songId').isInt(), validationReqFilter, (req, res, next) => {
    adminController.handleEditSong(req, res)
        .then(() => res.json(ResultOk())).catch(next);
});

/**
 * @swagger
 * /admin/album:
 *   delete:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - Administrator
 *     description: Delete album record (mark as invisible record) in database.
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: albumId
 *       description: The albumId.
 *       in: query
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Success!
 */
router.delete("/album", query('albumId').isInt(), validationReqFilter, (req, res, next) => {
    adminController.handleDelAlbum(req.query.albumId)
        .then(() => res.json(ResultOk())).catch(next);
});

/**
 * @swagger
 * /admin/song:
 *   delete:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - Administrator
 *     description: Delete the song record (mark as invisible record) from system.
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: songId
 *       description: The songId.
 *       in: query
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Success!
 */
router.delete("/song", query('songId').isInt(), validationReqFilter, (req, res, next) => {
    adminController.handleDelSong(req.query.songId)
        .then(() => res.json(ResultOk())).catch(next);
});

/**
 * @swagger
 * /admin/credit:
 *   delete:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - Administrator
 *     description: Delete the credit record (mark as invisible record) from system.
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: creditId
 *       description: The songId.
 *       in: query
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Success!
 */
router.delete("/credit", query('creditId').isInt(), validationReqFilter, (req, res, next) => {
    adminController.handleDelCredit(req.query.creditId)
        .then(() => res.json(ResultOk())).catch(next);
});

module.exports = router;
