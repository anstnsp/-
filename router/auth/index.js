const router = require('express').Router();
const controller = require('./auth.controller');


/*================
||    로그아웃   ||
==================*/
router.get("/logout", controller.logOut);

/*================
|| 로그인 성공 시||
==================*/
router.get("/login_success",controller.isLoggdIn, (req,res) => {
    console.log(req.user);
    res.redirect("/");
});
/*================
|| 로그인 실패 시||
==================*/
router.get("/login_fail", (req,res) => {
    console.log("로그인 실패");
    res.redirect("/");
});
/*================
||페이스북 로그인||
==================*/
router.get("/login/facebook", controller.FaceBookIsAuthenticate);

//auth/facebook/callback은 페이스북이 검증을 마치고 난 결과를 전송해주는 주소.

router.get("/facebook/callback", controller.CallbackFaceBook, (req,res) => {
    res.redirect("/");
});

/*================
||카카오톡 로그인||
==================*/
router.get("/login/kakao", controller.KAKAOIsAuthenticate);
router.get("/kakao/callback", controller.CallbackKAKAO );



/*=================
||  로컬 로그인  ||
==================*/
router.post("/login",controller.isAuthenticated,controller.login); //passport로 먼저 로그인검증 거친 후 토큰 검증
router.get("/loginPage", controller.loginPage);
/*
로그인 요청을 할 링크
이 링크를 html로 만들고 클릭하면 passport를 통해 페이스북으로 로그인 요청이 전송된다.
authenticate뒤의 facebook은 사용할 전략의 이름을 적어주면 된다.
authType: 'rerequest'는 매번 로그인 할 때마다 뒤의 public_profile과 email을 달라고 요청하는 거.
이것을 해둬야 실수로 사용자가 요청을 거절했을 때 다음 로그인 시 다시 얻어올 수 있다.
뒤에 scopo는 페이스북에 사용자에 대한 정보로 무엇을 요청할지 정하는 부분.
*/


module.exports = router;




