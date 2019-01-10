const router = require('express').Router();
const controller = require('./auth.controller');



//회원로그인
router.post("/login", controller.login);
router.get("/loginPage", controller.loginPage);

module.exports = router;
