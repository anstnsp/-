const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

/*
.sort()함수는 string이나 object를 받아서 데이터를 오름차순으로 정렬하는데 -붙이면 내림차순입니다..
두가지 이상으로 정렬하는 경우 빈칸을 넣고 각각의 항목을 적어주면 됩니다. 
object를 넣는 경우 {createdAt:1}(오름차순), {createdAt:-1}(내림차순) 이런식으로 넣어주면 됩니다.
*/
//Index
router.get("/", (req, res) => {
    Post.find({})
    .sort("-createdAt") 
    .exec((err, posts) =>{
        if(err) return res.json(err);
        res.render("posts/index", {posts:posts});
    });
});

// new 
router.get("/new", (req, res) =>{
    res.render("posts/new");
});

//create
router.post("/", (req, res) => {
    Post.create(req.body, (err, post) => {
        if(err) return res.json(err);
        res.redirect("/posts");
    });
});

//show
router.get("/:id", (req, res) => {
    Post.findOne({_id:req.params.id}, (err, post) => {
        if(err) return res.json(err);
        res.render("posts/show", {post:post});
    })
})

// edit
router.get("/:id/edit", function(req, res){
    Post.findOne({_id:req.params.id}, function(err, post){
     if(err) return res.json(err);
     res.render("posts/edit", {post:post});
    });
   });
   
   // update
   router.put("/:id", function(req, res){
    req.body.updatedAt = Date.now(); // 2
    Post.findOneAndUpdate({_id:req.params.id}, req.body, function(err, post){
     if(err) return res.json(err);
     res.redirect("/posts/"+req.params.id);
    });
   });
   
   // destroy
   router.delete("/:id", function(req, res){
    Post.remove({_id:req.params.id}, function(err){
     if(err) return res.json(err);
     res.redirect("/posts");
    });
   });
   
   module.exports = router;