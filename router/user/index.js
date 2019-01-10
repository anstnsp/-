const router     = require("express").Router();
const controller = require("./user.controller");
const auth       = require("../auth");
/*
와일드카드를 사용할 때는 순서가 중요합니다.
app.get('/post/:id', () => {});
app.get('/post/a', () => {});
이렇게 되어있다면 /post/a에 요청이 왔을 때 한 눈에 보기엔 사람들은 두 번째 라우터에 걸릴거라고 생각하지만 
/post/:id에 먼저 걸립니다. /post/a의 콜백 함수는 실행되지 않습니다. 
따라서 와일드카드 라우터는 항상 다른 라우터들보다 뒤에 적어주는 것이 좋습니다.

*/
//회원리스트보기
router.get("/", controller.readUserList);
//회원가입페이지로이동
router.get("/new", controller.signupPage);
//회원가입
router.post("/", controller.signupUser);
//회원정보보기
router.get("/:username", controller.showUserInfo);
//회원정보수정페이지
router.get("/:username/edit", controller.editPage);
//회원정보수정
//router.put("/:username", controller.editUser);


module.exports = router;