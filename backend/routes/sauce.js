const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/',auth, multer, sauceCtrl.createSauce);//valid
router.post('/:id/like', auth, sauceCtrl.likeSauce);

router.get('/', auth, sauceCtrl.getAllSauces);//valid
router.get('/:id', auth, sauceCtrl.getOneSauce);//valid

router.put('/:id', auth, multer, sauceCtrl.modifySauce);//valid

router.delete('/:id', auth, sauceCtrl.deleteSauce);//valid



module.exports = router;