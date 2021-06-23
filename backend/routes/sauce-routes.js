const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce-controller');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Routes CRUD pour les sauces 

//CREATE
router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
//READ
router.get('/', sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
//UPDATE
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//DELETE
router.delete('/:id', auth, sauceCtrl.deleteSauce);



module.exports = router;