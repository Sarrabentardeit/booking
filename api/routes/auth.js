const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register); //register
router.post('/login', authController.login); //login

  

module.exports = router;
