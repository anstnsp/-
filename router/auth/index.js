const router = require('express').Router();
const controller = require('./auth.controller');


router.post("/", controller.login);

module.exports = router;
