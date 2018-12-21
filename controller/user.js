const User = require("../models/User");

const jwt = require("jsonwebtoken");


exports.readUserList = (req, res) =>{

    User.find({})
        .sort({username:1})
        .exec((err, users) =>{
            if(err) return res.json(err);
            res.render("users/index", {users:users});
        });

}

exports.signupPage = (req, res) => {
    res.render("users/new", {user:{}});
}

exports.signupUser = (req,res) => {

    let user = new User();
    user.username = req.body.username;
    user.name     = req.body.name;
    user.email    = req.body.email;
    user.password = req.body.password;
    console.log(user);
    user.save((err,users) => {
        if(err) return res.json(err);
        console.log("회원가입한 유저의 정보:"+JSON.stringify(users));
        res.redirect("/user");
    });

}

exports.showUserInfo = (req,res) => {
    User.findOne({username:req.params.username}, (err, user)=>{
        if(err) return res.json(err);
        res.render("users/show", {user:user});
    });
}

exports.editPage = (req,res) => {
    User.findOne({username:req.params.username}, (err, user)=>{
        if(err) return res.json(err);
        res.render("users/edit", {user:user});
    });
}

exports.editUser = (req,res) => {
    User.findOne({username:req.params.username}) // 2-1
        .select("password") // 2-2
        .exec(function(err, user){
            if(err) return res.json(err);

            // update user object
            user.originalPassword = user.password;
            user.password = req.body.newPassword? req.body.newPassword : user.password; // 2-3
            for(var p in req.body){ // 2-4
                user[p] = req.body[p];
            }

            // save updated user
            user.save((err, user) => {
                if(err) return res.json(err);
                res.redirect("/users/"+req.params.username);
            });
        });
}


//
// exports.createUser = (req,res) =>{
//
//     // let param = {
//     //      userID = req.body.userID,
//     //      password = req.body.pasab
//     //      address = req.body.address,
//     //      phoneNumber = req.body.phoneNumber,
//     //      email = req.body.email
//     // }
//
//     console.log(userName);
//     new user({user: param}).save((err, doc) =>{
//
//         if(doc) { //데이터가 들어갔는지 체크
//             console.log(doc);
//             res.send("유저가 생성되었습니다.");
//         }
//
//     })
//
// }
//
// exports.readUser = (req,res) =>{
//
//     console.log(req.user);
//     let token = jwt.sign(req.user, jwtkey);
//     res.send("token");
// }
//
// exports.updateUser = (req,res) =>{
//     res.send("유저가 수정됨");
// }
//
// exports.deleteUser = (req,res) =>{
//     res.send("유저가 삭제됨");
// }
encryptoHash = (password) => {
    //비밀번호 hash암호화 하여 저장
    let hash = crypto.createHash("sha256");
    hash.update(password);
    let hash_password = hash.digest("hex");

    return hash_password;
}