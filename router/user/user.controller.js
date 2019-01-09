const User   = require("../../models/User");
const auth   = require("../auth"); //passport를 통해 인증
const crypto = require("crypto");
const nodeMailer       = require("nodemailer");
//회원리스트보기
exports.readUserList = (req, res) =>{

    User.find({})
        .sort({username:1})
        .exec((err, users) =>{
            if(err) return res.json(err);
            res.render("users/index", {users:users});
        });

}

//회원가입페이지
exports.signupPage = (req, res) => {
    res.render("users/new", {user:{}});
}

/* ========================
||  회원가입 이메일 보내기  ||
==========================*/
exports.sendEmail = (req,res,next) => {

    let email = req.param("email");
     random = Math.floor((Math.random() * 10000) +54 );
     req.session.random = random;
     console.log("req.session.random:"+req.session.random);
 
    let transportor = nodeMailer.createTransport({ //메일발송객체 생성
        service : "gmail",   //어떤 메일서비스로 메일을 보낼 것인지 
        auth    : {
            user : process.env.GMAIL_ACCOUNT,         //메일을 보낼 gmail 계정 아이디
            pass : process.env.GMAIL_PASSWORD         //메일을 보낼 gmail 계정 비밀번호
        }
    });
  
    let mailOption = {                  //메일옵션 

        from    : "anstnsp1@gmail.com", //발송 메일 주소 (위에 작성한 gmail 아이디)
        to      : email,                //수신 메일 주소
        subject : "안녕하세요 문슈's 입니다. 이메일 인증을 해주세요.",  // 제목
        // html    : '<p>아래의 링크를 클릭해주세요 !</p>' +
        //     "<a href=  'http://localhost:7777/user/verifyEmail/?email="+ email +"&token="+token+"'>회원가입 인증하기</a>"
        html    : '귀하의 인증번호는 <bold>' + random + "</bold>입니다."
    };

    transportor.sendMail(mailOption, (err,info) => {
        if (err) {
            console.log(err);
        } else {
            console.log("회원가입 이메일 발송 완료!!" + info.response);
            res.send(email+"로 인증번호 전송완료!!");
            
        }
    });
    
}

exports.comfirmEmailNum = (req,res,next) => {
 
    //입-력한 이메일인증번호랑 서버에서 보낸 인증번호가 같으면 next 아니면 인증번호 다르다고 표시
    let comfirmEmailNum = req.param("comfirmEmailNum");
    let random =req.session.random;

    let isBoolean = "";  
    if(comfirmEmailNum == random) {
        isBoolean = true;
    } else {
        isBoolean = false;
    }

    res.send(isBoolean);
}


//회원가입
exports.signupUser = (req,res) => {

    //요청으로 받은 비밀번호를 암호화 시킴.
    let hash_password = encryptoHash(req.body.password);
    let user1 = new User();
    user1.username = req.body.username;
    user1.name     = req.body.name;
    user1.email    = req.body.email;
    user1.password = hash_password;
 
    User.findOne({username:req.body.name}, (err,user) => {
        if(err) {       //서버에러
            return res.json({
                type:false,
                data: err });
        } else if (user) { //name이 이미 존재할 때
            return res.json({
                type:false,
                data: "해당 name은 이미 존재합니다"
            });
        } else if(!user) {  //서버에러 없고 name없을 때 회원가입 처리
            user1.save((err,users) => {
                if(err) return res.json(err);
                console.log("회원가입한 유저의 정보:"+JSON.stringify(users));
                res.redirect("/user");
            });
        }
    });

}


//회원정보보는페이지
exports.showUserInfo = (req,res) => {
    console.log("회원정보보기페이지 ")
    User.findOne({username:req.params.username}, (err, user)=>{
        if(err) return res.json(err);
        res.render("users/show", {user:user});
    });
}
//회원정보수정
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

encryptoHash = (password) => {
    let hash = crypto.createHash("sha256");
    hash.update(password);
    let hash_password = hash.digest("hex");
    return hash_password;

}
