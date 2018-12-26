const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const uuid = require("uuid");

//로그인페이지
exports.loginPage = (req,res) => {
    console.log("로긴페이지 들어옴 ");
    res.render("users/login");
}
//
exports.authenticateToken = (req,res) => {


}


//토근발급
exports.login = (req,res,next) => {

    //1.유저의 로그인 아디와 패스워드 받음 .
    const username = req.body.username;
    const password = req.body.password;

    //2.유저아이디가 디비에 있는지 확인.
    User.findOne({username: req.body.username}, (err, user) => {
        if (err) {
            console.log("해당 아이디는 존재하지 않습니다.");
            return res.json(err);
        } else {
            console.log("아이디 존재");
            //3.유저아이디가 있다면 해당 아이디에 대한 비밀번호가 맞는지 확인.
            if (user.password === encryptoHash(req.body.password)) {
                //4.유저아이디가 확인되고 비밀번호가 일치한다면 토큰 발급.
                const jwtData = {
                    exp: Math.floor(Date.now() / 1000) + (60 * 3), // 3분
                    data: {username, password},
                    uuid: uuid()    // jwt token을 매번 다르게 생성하기 위한 설정

                };

                jwt.sign(jwtData, process.env.JWT_SECRET, (err, token) => {

                    if (err) {
                        console.log(err);
                        callback(err, "jwt create err");
                    } else {
                        console.log("토큰발급 성공!" + token);
                        console.log("로그인 성공!! 앞으로는 토큰으로 로그인 인증")
                        return res.json({message : "토큰발급성공",token,username,password});

                       // res.redirect("/");
                    } //else

                });

            } else {
                console.log("비밀번호가 틀림");
                return res.json("비밀번호가 틀립니다.");
            } //else

        } //else

    }) //User.findOne

};


encryptoHash = (password) => {
    let hash = crypto.createHash("sha256");
    hash.update(password);
    let hash_password = hash.digest("hex");
    return hash_password;

}
