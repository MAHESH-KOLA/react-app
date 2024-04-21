const {Router} = require('express');
const routeController = require('../controllers/routeControllers')
const router = Router();

router.post('/signup', routeController.signup_post);
router.post('/login', routeController.login_post);
router.post('/logout', routeController.logout_get);
router.get('/profile',routeController.profile_get);

module.exports = router;