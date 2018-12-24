const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const UserController = require("../user/user.controller");

exports.login = (req,res) => {

    const {username, password} = req.body;
    const secret = req.app.get("jwt-secret");

    //유저아이디확인 및 jwt 생성
findOnebyUsername = (username) => {
    User.findOne({username:username}, (err,user) => {
        if(err) {
            throw new Error("해당 username이 존재하지 않습니다.")
        } else {
            //username이 존재할 때 비밀번호 확인

            if(user.password === UserController.encryptoHash(req.body.password)) {
                // jwt를 비동기로 생성하는 promise 만듬
                console.log("이부분이 나온다면 유저패스워드와 디비저장 패스워드 같다는거임 ")
                const p = new Promise( (resolve, reject) => {
                    jwt.sign(
                        {
                            _id      : user._id,
                            username : user.username,
                        },
                        secret,
                        {
                            expiresIn : "7d",
                            issuer    : "anstnsp",
                            subject   : "userInfo"
                        }, (err, token) => {
                            if (err) reject(err);
                            resolve(token);
                        })
                })
                return p;
            } else {
                throw new Error("로그인 실패!!");
            }
        }
    });
}

    //토큰 발급
    const respond = (token) => {
        res.json({
            message : "로그인 성공!!",
            token
        })
    };

    //에러발생
    const onError = (error) => {
        res.status(403).json({
            message : error.message
        })
    };

    findOnebyUsername(username)
        .then(respond)
        .catch(onError);

};



