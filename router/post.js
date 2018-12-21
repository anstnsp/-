const express        = require("express");
const router         = express.Router();
const Post           = require("../models/Post");
const PostController = require("../controller/post");

//게시물리스트
router.get("/", (req, res) => {
    PostController.readPostList(req, res);
});

// 게시물작성페이지
router.get("/new", (req, res) =>{
    PostController.writePostPage(req,res);
});

//게시물작성
router.post("/", (req, res) => {
    PostController.writePost(req,res);
});

//show
router.get("/:id", (req, res) => {
    PostController.readPostInfo(req,res);
})

// edit
router.get("/:id/edit", (req, res) => {
    PostController.goEditPage(req,res);
});

// update
router.put("/:id", (req, res) => {
    PostController.editPost(req,res);
});

// destroy
router.delete("/:id", (req, res) => {
    PostController.deletePost(req,res);
});

module.exports = router;