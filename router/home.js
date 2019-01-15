const express = require("express");
const router = express.Router();
const http = require('http');
const io                = require("socket.io")(http); 

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
    res.render("home");
    //res.sendFile(path.resolve(__dirname,'..','view','index.ejs'))
   
})

//1.유저가 유저 정보를 가지고 들어온다. ( 입장)
//2.입장하면 io 발생 
//3.접속하기 버튼 클릭하면 접속 하면서 [누구가 입장했습니다.]
//4.현재 접속자보여주기 
//5.메세지 보내기 

router.get("/chat", (req,res) => {
   
    io.on('connection', function (socket) {
        // 최초 접속시 호출 

        //접속하기 버튼을 눌렀을 때 
        socket.on("chat_join", function(data){
            let name = data+"님이 입장하였습니다."; 
            io.emit("chat_conn",name);
        })
    
        //유저가 접속하기 버튼을 눌렀을때
        socket.on("chat_join", function(data){
            let name = data;
            io.emit("user_join", name); 
        })
    
    
        socket.on('disconnect', function(){ 
            console.log('user disconnected: ', socket.id);
            io.emit("receive message",name+"님이 퇴장하였습니다." )
          });
    
        socket.on("send message", function(name, text){
            let msg = name + " : " + text; 
            console.log(msg);
            io.emit("recieve message", msg);
    
        })
    })
    res.render("chat2");
})
module.exports = router;