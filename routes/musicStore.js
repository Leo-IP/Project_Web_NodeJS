'use strict';
const path = require('path');
const express = require('express');
const ErrorJson = require('../jsonFormats/responses/ErrorJson');
const MusicStoreController = require('../controllers/MusicStoreController');
const CartController = require('../controllers/CartController');
const UserAccountController = require('../controllers/UserAccountController');

const router = express.Router();
const musicStoreController = new MusicStoreController();
const userAccountController = new UserAccountController();
const cartController = new CartController();

const userLoggedInEjsProps = require('../middlewares/userLoggedInEjsProps');
const redirectNonMemberEjs=require('../middlewares/redirectNonMemberEjs');
const userSessionCheck=require('../middlewares/userSessionCheck');


/** EJS render routes **/
router.get('/', userLoggedInEjsProps, (req, res, next) => {
    musicStoreController.getAlbumList().then((albumList) => {
        res.render('layout', {page: 'browse', albumList});
    }).catch(next);
});

router.get('/view-album/:albumId', userLoggedInEjsProps, async (req, res, next) => {
    let isUserBoughtAlbum = false;
    let userBoughtSongs = [];
    const [albumInfo, songList] = await musicStoreController.getAlbumSongs(req.params.albumId);
    if (!albumInfo) return next();

    if (req.session.memberId) {
        isUserBoughtAlbum = await musicStoreController.checkUserBoughtAlbum(req.session.memberId, albumInfo.ProductId);
        if (!isUserBoughtAlbum) {
            userBoughtSongs = await musicStoreController.checkUserBoughtSongs(req.session.memberId, songList.map(item => item.ProductId));
        }
    }

    res.locals.title = albumInfo.Name;
    res.render('layout', {page: 'viewAlbum', isUserBoughtAlbum, userBoughtSongs, albumInfo, songList});
});

router.get("/cart", redirectNonMemberEjs, userLoggedInEjsProps, async function (req, res) {
    const alist = await cartController.getAlbumList();
    const [albumInfo, songList] = await cartController.getAlbumSongs(req.query.albumid);
    const userProfile = await userAccountController.handleUserProfile(req, res);
    res.render('layout', {page: 'cart', albumItems: alist, albumId: req.query.albumid, albumInfo, songList, userProfile});
});

/** EJS render routes **/


/** Send album cover image **/
router.get('/cover/:imageId', (req, res) => {
    res.set({
        "Content-Type": "image, image/jpeg, image/png, image/gif",
    });
    res.sendFile(path.join(__dirname, '../files/covers/', req.params.imageId));
});
/** Send album cover image **/


/**
 * @swagger
 * tags:
 *   name: MusicStore
 *   description: Routes of Music Store for normal user
 */

/**
 * @swagger
 * /store/listen-trial/{filename}:
 *   get:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - MusicStore
 *     description: Provide a trial version of the song for users to listen to. In order to help users to decide the songs or albums is suitable for them or not.
 *     produces:
 *     - application/octet-stream
 *     parameters:
 *     - name: filename
 *       description: The filename of trial song.
 *       in: path
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Success!
 */
router.get("/listen-trial/:filename", (req, res, next) => {
    musicStoreController.checkTrialSongFile(req.params.filename)
        .then((isExisted) => {
            if (!isExisted) return res.status(404).json(ErrorJson('Not found'));
            res.set({"Content-Type": "audio/mpeg"});
            res.sendFile(path.join(__dirname, '../files/songs/' + req.params.filename));
        }).catch(next);
});

/**
 * @swagger
 * /store/checkout-order:
 *   post:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - MusicStore
 *     description: Create an transaction and confirm for the purchase order from the user.
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: items
 *       description: List of albumId and songId to purchase.
 *       in: formData
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Success!
 */
router.post("/checkout-order", userLoggedInEjsProps, async function (req, res) {
    await cartController.handleCheckout(req, res);
    res.send({});
});

/**
 * @swagger
 * /store/download-song:
 *   get:
 *     security:
 *     # - api_key: []
 *     tags:
 *      - MusicStore
 *     description: Allow the user to download their purchased song.
 *     produces:
 *     - application/octet-stream
 *     parameters:
 *     - name: albumpid
 *       description: The product id of album.
 *       in: query
 *       required: true
 *       type: string
 *     - name: songpid
 *       description: The product id of song.
 *       in: query
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Success!
 */
router.get("/download-song",userSessionCheck, async (req, res, next) =>{
    musicStoreController.getFullSongCheckUserForDown(req.session.memberId, req.query.albumpid, req.query.songpid)
        .then((songFile) => {
            if (!songFile) return res.status(404).json(ErrorJson('Restricted'));
            res.set({
                "Content-Type": "audio/mpeg",
                "Content-Disposition": `attachment; filename="${encodeURIComponent(songFile.Name)}.mp3"`
            });
            res.sendFile(path.join(__dirname, '../files/songs/' + songFile.FullVerFile));
        }).catch(next);
});

module.exports = router;
