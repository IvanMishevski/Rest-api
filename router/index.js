const router = require('express').Router();
const users = require('./users');
const jobs = require('./jobs');
const applications = require('./applications');
const test = require('./test');
const { authController } = require('../controllers');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.use('/users', users);
router.use('/recipes', jobs);
router.use('/comments', applications);
router.use('/test', test);

module.exports = router;
