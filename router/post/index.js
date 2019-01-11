const router = require("express").Router();
const controller = require("./post.constroller");


//게시물 댓글불러오기
router.get("/reply", controller.readComments)
//게시물검색 
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
router.put("/:id",checkPermission, controller.editPost);
//해당게시물 삭제하기
router.delete("/:id",checkPermission, controller.deletePost);
//게시물에 댓글달기 
router.post("/reply", controller.addComment)



module.exports = router;

function checkPermission(req, res, next){
    Post.findOne({_id:req.params.id}, function(err, post){
     if(err) return res.json(err);
     if(post.writer != req.user.username) return res.send("해당게시물 작성자가 아닙니다.");
     
     next();
    });
   }