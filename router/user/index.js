const router     = require("express").Router();
const controller = require("./user.controller");
const authController       = require("../auth/auth.controller");

//회원리스트보기
router.get("/", controller.readUserList);
//회원가입페이지로이동
router.get("/new", controller.signupPage);

//회원가입
router.post("/",controller.signupUser);
//회원가입인증번호받기
router.get("/sendEmail", controller.sendEmail);
//회원가입 인증번호확인
router.get("/comfirmEmailNum", controller.comfirmEmailNum);


//회원정보보기
router.get("/:username", controller.showUserInfo);
//회원정보수정페이지
router.get("/:username/edit", controller.editPage);
//회원정보수정
//router.put("/:username", controller.editUser);


module.exports = router;

//인증하기 누르면 토큰과 이메일 검증하고 next로 signup 호출해야함.
//메일 보내기 -> 회원가입폼에 전송받은 번호 입력 -> 전송한 것과 입력한 것이 맞는지 검사 -> 맞다면 가입완료 
