const router = require("express").Router();
const controller = require("./post.constroller");

//게시물 검색
router.get("/search", controller.searchPost);
//게시물리스트
router.get("/", controller.readPostList);
//게시물작성페이지
router.get("/new", controller.writePostPage);
//게시물작성
router.post("/", controller.writePost);
//해당게시물보기
router.get("/:id", controller.readPostInfo);
//해당게시물수정페이지
router.get("/:id/edit", controller.goEditPage);
//해당게시물수정하기
router.put("/:id", controller.editPost);
//해당게시물 삭제하기
router.delete("/:id", controller.deletePost);




module.exports = router;