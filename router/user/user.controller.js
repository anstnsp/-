const User   = require("../../models/User");
const auth   = require("../auth"); //passport를 통해 인증
const crypto = require("crypto");


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

    //요청으로 받은 비밀번호를 암호화 시킴.
    let hash_password = encryptoHash(req.body.password);

    let user = new User();
    user.username = req.body.username;
    user.name     = req.body.name;
    user.email    = req.body.email;
    user.password = hash_password;
    console.log(user);
    user.save((err,users) => {
        if(err) return res.json(err);
        console.log("회원가입한 유저의 정보:"+JSON.stringify(users));
        res.redirect("/user");
    });

}

exports.showUserInfo = (req,res) => {
    console.log(req);
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
//
// exports.editUser = (req,res) => {
//     User.findOne({username:req.params.username}) // 2-1
//         .select("password") // 2-2
//         .exec(function(err, user){
//             if(err) return res.json(err);
//
//             // update user object
//             user.originalPassword = user.password;
//             user.password = req.body.newPassword? req.body.newPassword : user.password; // 2-3
//             for(var p in req.body){ // 2-4
//                 user[p] = req.body[p];
//             }
//
//             // save updated user
//             user.save((err, user) => {
//                 if(err) return res.json(err);
//                 res.redirect("/users/"+req.params.username);
//             });
//         });
// }

exports.encryptoHash = (password) => {
    let hash = crypto.createHash("sha256");
    hash.update(password);
    let hash_password = hash.digest("hex");
    return hash_password;

}
