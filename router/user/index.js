const router     = require("express").Router();
const controller = require("./user.controller");
const authController       = require("../auth/auth.controller");
//회원리스트보기
router.get("/", controller.readUserList);
//회원가입페이지로이동
router.get("/new", controller.signupPage);
//회원가입
router.post("/", authController.verifyEmail, controller.signupUser);
//회원정보보기
router.get("/:username", controller.showUserInfo);
//회원정보수정페이지
router.get("/:username/edit", controller.editPage);
//회원정보수정
//router.put("/:username", controller.editUser);


module.exports = router;

//인증하기 누르면 토큰과 이메일 검증하고 next로 signup 호출해야함.