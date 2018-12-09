const user = require("../models/user");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


exports.createUser = (req,res) =>{

    // let param = {
    //      userID = req.body.userID,
    //      password = req.body.password,
    //      userName = req.body.userName,
    //      address = req.body.address,
    //      phoneNumber = req.body.phoneNumber,
    //      email = req.body.email
    // }

    console.log(userName);
    new user({user: param}).save((err, doc) =>{
         
        if(doc) { //데이터가 들어갔는지 체크 
            console.log(doc);
            res.send("유저가 생성되었습니다.");
        }

    })
    
}

exports.readUser = (req,res) =>{

    console.log(req.user);
    let token = jwt.sign(req.user, jwtkey);
    res.send("token");
}

exports.updateUser = (req,res) =>{
    res.send("유저가 수정됨");
}

exports.deleteUser = (req,res) =>{
    res.send("유저가 삭제됨");
}