const express = require("express");
const router = express.Router();


//메인페이지
router.get('/', (req, res) => {

    if(req.user) {
        console.log("_id:"+req.user._id)
        console.log("joinDate:"+req.user.joinDate)
        console.log("username:"+req.user.username)
        console.log("usertoken:"+req.user.FBToken)
        console.log("displayname:"+req.user.displayName)
    } else { 
        console.log("req.user 정보없음 ")
    }
    
    //ejs파일을 사용하기 위해서는 res.render함수를 사용해야 하며
    //첫번째 파라미타로 ejs의 이름을
    //두번째 파라미터로 ejs에서 사용될 object를 전달합니다.
    //res.render함수는 ejs를 /views폴더에서 찾으므로 views폴더의 이름을 변경하면 안됩니다.
    //res.redirect("home");
    res.render("home", {user:req.user});
    //res.sendFile(path.resolve(__dirname,'..','view','index.ejs'))
   
})



module.exports = router;