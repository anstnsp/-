const user = require("../models/user");



exports.createUser = (req,res) =>{
    console.log("유저마늗ㄹ기 처음 ")
    let userName = req.body.userName;
    let password = req.body.password;
    console.log(userName);
    new user({userName : userName, password : password}).save((err, doc) =>{
         
        if(doc) { //데이터가 들어갔는지 체크 
            console.log(doc);
            res.send("유저가 생성되었습니다.");
        }

    })
    
}

exports.readUser = (req,res) =>{
    res.send("유저가 읽히게됨");
}

exports.updateUser = (req,res) =>{
    res.send("유저가 수정됨");
}

exports.deleteUser = (req,res) =>{
    res.send("유저가 삭제됨");
}