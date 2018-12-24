const Post = require("../../models/Post");


/*
.sort()함수는 string이나 object를 받아서 데이터를 오름차순으로 정렬하는데 -붙이면 내림차순입니다..
두가지 이상으로 정렬하는 경우 빈칸을 넣고 각각의 항목을 적어주면 됩니다.
object를 넣는 경우 {createdAt:1}(오름차순), {createdAt:-1}(내림차순) 이런식으로 넣어주면 됩니다.
*/
//게시물리스트 불러오기
exports.readPostList =  (req,res) => {
    Post.find({})
        .sort("-createdAt")
        .exec((err, posts) =>{
            if(err) return res.json(err);
            res.render("posts/index", {posts:posts});
        });
};

//게시물작성페이지로 이동
exports.writePostPage = (req,res) => {
    res.render("posts/new");
}

//게시물작성
exports.writePost = (req,res) => {
    Post.create(req.body, (err, post) => {
        if(err) return res.json(err);
        console.log("게시물 작성 입력 값:"+ JSON.stringify(post));
        res.redirect("/posts");
    });
}

//해당게시물보기
exports.readPostInfo = (req,res) => {
    Post.findOne({_id:req.params.id}, (err, post) => {
        if(err) return res.json(err);
        res.render("posts/show", {post:post});
    })
}

//게시물수정페이지로이동
exports.goEditPage = (req,res) => {
    Post.findOne({_id:req.params.id}, (err, post) => {
        if(err) return res.json(err);
        res.render("posts/edit", {post:post});
    });
}

//게시물수정
exports.editPost = (req,res) => {
    req.body.updatedAt = Date.now(); // 2
    Post.findOneAndUpdate({_id:req.params.id}, req.body, (err, post) => {
        if(err) return res.json(err);
        console.log("게시물 수정한 값:"+ JSON.stringify(post));
        res.redirect("/posts/"+req.params.id);
    });
}

//게시물삭제
exports.deletePost = (req,res) => {
    Post.remove({_id:req.params.id}, (err) => {
        if(err) return res.json(err);
        res.redirect("/posts");
    });
}