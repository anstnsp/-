const express = require("express");
const router = express.Router();
const user = require("../../controller/user");
const auth = require("../../auth/auth"); //passport를 통해 인증

console.log('여긴 라우터');
router.get("/",auth.isBasicAutenticated, user.readUser);
router.post("/", user.createUser);
router.put("/",auth.isBasicAutenticated, user.updateUser);
router.delete("/",auth.isBasicAutenticated, user.deleteUser);


module.exports = router;