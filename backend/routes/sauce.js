const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');

router.post('/', sauceCtrl.createSauce); 
router.get('/', sauceCtrl.getAllSauces);//valid
router.get('/:id', sauceCtrl.getOneSauce);//valid
router.put('/:id', sauceCtrl.modifySauce);
router.delete('/:id', sauceCtrl.deleteSauce);//valid

module.exports = router;