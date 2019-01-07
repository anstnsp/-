const Post = require("../../models/Post");


/*
.sort()함수는 string이나 object를 받아서 데이터를 오름차순으로 정렬하는데 -붙이면 내림차순입니다..
두가지 이상으로 정렬하는 경우 빈칸을 넣고 각각의 항목을 적어주면 됩니다.
object를 넣는 경우 {createdAt:1}(오름차순), {createdAt:-1}(내림차순) 이런식으로 넣어주면 됩니다.
*/
//게시물리스트 불러오기
exports.readPostList =  (req,res) => {

    // 처음 index로 접속 했을시 나오는 부분
    // db에서 게시글 리스트 가져와서 출력
    // page는 1-5까지 보여줌 -> db에서 총 갯수 잡아와서 10으로 나눠서 올림해야함
    // 한페이지에 10개의 게시글: limit: 10, skip: (page-1)*10 이면 될 듯
    // page number는 param으로 받아오기 가장 처음엔 param 없으니까 그땐 자동 1로 설정
    Pagination(req,res,5,{});
   
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
        //조회수 1 늘리기
        post.count +=1;
        //조회수 1늘린거를 디비에 저장
        post.save((err) => {
            if(err) throw err;
        });

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

exports.searchPost = (req,res) => {
    let searchType = req.param("searchType");
    let search_word = req.param("searchWord");
    let searchCondition = {$regex:search_word};

    console.log("searchType:"+searchType);
    console.log("searchCondition:"+searchCondition);
    console.log("search_word:"+search_word)

    if(searchType === "title_contents") {
        Pagination(req,res,5,{$or:[{title:searchCondition}, {contents: searchCondition}]});
    } else if(searchType === "title") {
        Pagination(req,res,5,{title:search_word});
    } else if(searchType === "contents") {
        Pagination(req,res,5,{contents:search_word});
    } else if(searchType === "wrtier") {

    }


}

//pagination(req,res,한페이지에 보여줄 게시물갯수, 몽고디비검색조건)
Pagination = (req,res,limitPage,queryCondition) => {
    let page = Math.max(1,req.query.page);
    let limit = limitPage; //한 페이지에 보여줄 게시물 갯수
    Post.count(queryCondition, (err,count) => { //개시물의 총 갯수 count
        if(err) return res.json({message:err});
        let skipSize = (page-1)*limit; // 3번째 페이지를 클릭하면 limit*2개 건너뜀
        let maxPage = Math.ceil(count/limit); 
                 
        Post.find(queryCondition).sort("date:1").skip(skipSize).limit(limit).exec((err,posts) => {
        if(err) return res.json({message:err});
        console.log("검색조건으로 찾은 내용:"+JSON.stringify(posts));
        res.render("posts", {posts:posts, page:page, maxPage:maxPage});
    })
    })
}
