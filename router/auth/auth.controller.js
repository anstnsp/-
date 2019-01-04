const jwt              = require("jsonwebtoken");
const User             = require("../../models/User");
const uuid             = require("uuid");
const passport         = require("passport");
const LocalStrategy    = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const nodeMailer       = require("nodemailer");
const KakaoStrategy    = require("passport-kakao").Strategy;
/* ========================
|| passport-kakao 인증   ||
==========================*/
exports.KAKAOIsAuthenticate = passport.authenticate("kakao");

exports.CallbackKAKAO = passport.authenticate("kakao",{
    successRedirect : "/auth/login_success",
    failureRedirect : "/auth/login_fail"
});

passport.use(new KakaoStrategy({

    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: "", //clientSecret을 사용하지 않는다면 넘기지 말거나 빈스트링
    callbackURL: process.env.KAKAO_CALLBACK_URL

},
    (accessToken,refreshToken, profile, done) => {
    //사용자의 정보는 profile 안에 있다.
        console.log("카카오 프로필:"+JSON.stringify(profile));
        User.findOne({username:profile.displayName}, (err,user) =>{
            if(err) return done(err);
            if(!user) {
                user = new User({
                    username : profile.displayName,
                    name     : profile.id,
                    email    : profile._json.kaccount_email,
                    Provider : profile.provider,
                    KAKAOToken: accessToken
                });

                user.save((err) =>{
                    if(err) console.log(err);
                    return done(err,user);
                });
            } else {
                let tmp = accessToken;
                let tmp2 = new Date.now();
                User.findByIdAndUpdate(user._usernameField, { $set: { KAKAOToken:tmp}}, (err, user) =>{
                    if(err) return done(err);
                    done(null,user);
                });

            }
        });
    }
    ));

/* ========================
|| passport-facebook 인증||
==========================*/
exports.FaceBookIsAuthenticate = passport.authenticate("facebook", {authType: "rerequest", scope: ["public_profile", "email"]});
exports.CallbackFaceBook = passport.authenticate("facebook", {successRedirect: "/auth/login_success", failureRedirect: "/auth/login_fail"});

passport.use(new FacebookStrategy({
    clientID : process.env.FACEBOOK_CLIENT_ID, //페북 클라이언트 아이디
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET, //페북 클라이언트 시크릿
    callbackURL: process.env.FACEBOOK_CALLBACK_URL , //홈페이지주소/auth/facebook/callback
    passReqToCallback: true //true면 뒤의 콜백함수에 req매개변수를 추가해줌.
}, (req, accessToken, refreshToken, profile, done) => {
    console.log(JSON.stringify(profile));
    //profile.id로 이미 우리 사이트의 회원인가를 조회.
    User.findOne({ username: profile.displayName}, (err, user) => {
      if(user) { //회원 정보가 있으면 로그인
          console.log("페북회원가입시 회원정보가 있을 때 회원정보:"+user);
          return done(err, user);
      }
        const newUser = new User({ //없으면 회원생성
            username : profile.displayName,  // 회원이름
            Provider : profile.provider, //소셜제공자
            //email    : profile.email,
            FBToken  : accessToken

        });

      newUser.save((user) => {
          return done(null,user); //새로운 회원생성 후 로그인
      }); //newUser.save

    }); //User.findOne
})); // passport.use(new FacebookStrategy)

/* ========================
|| passport-local 인증    ||
==========================*/
exports.isAuthenticated = passport.authenticate("local");

//인증 후 사용자 정보를 세션에 저장
passport.serializeUser((user ,done) => {  //Strategy 성공 시 호출
    done(null, user); //여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
});
/*
일단 인증이 되어 로그인이 된 사용자는 매 reqeust마다 passport.deserializeUser메소드를 호출하게 되는데,
앞에서 serializeUser에서 저장한 사용자 id를 이용해서  사용자정보를 db에서 조회하거나 하여
done(null,user)로 리턴하면 HTTP request에 함꼐 리턴이 된다.
해당 사용자가 로그인 되어 있는지를 확인하려면 req.isAuthenticatedd를 이용하여 로그인 되어있는지 확인할 수 있고
페이지별로 로그인이 되어 있는지에 대해 접근제어를 하려면 함수를 하나 정의한 후에 router에 connect미들웨어로
전처리로 호출하게 해서 인증여부를 확인하면 된다.
 */
//인증 후, 사용자 정보를 세션에서 읽어서 request.user에 저장
//매번 각 페이지 접근시 마다 , 세션에 저장된 사용자 정보를 읽어서 HTTP request객체에 user라는 객체를 추가로 넣어서 리턴한다.
passport.deserializeUser((user,done) => { //매개변수 user는 serializeUser의 done의 인자 user를 받은 것 .
    done(null, user); //여기의 user가 req.user가 됨
});

passport.use(new LocalStrategy({
    usernameField : "username",  //usernameField와 passwordFiled는 어떤 폼 필드로부터 아디와 비번 받을지 설정하는 옵션.
    passwordField : "password",  //body에 데이터가 username: "a" ,password:"b"이렇게 오면 뒤의 콜백함수값이 username ->a,password ->b가 된다.
    session : true,             //세션에 저장여부(세션 사용할지 안할지)
    passReqToCallback : false,  //true로 해두면 뒤의 콜백에 req가 추가됨. req를 통해 express의 req객체에 접근 가능.
}, (username, password, done) => {

    User.findOne({username:username}, (finderr, user) => {

        if(finderr) return done(finderr); //(서버에러) 디비조회시 에러..
        if(!user) return done(null,false, { message: "존재하지 않는 아이디 입니다."}); //임의 에러 처리

        if(encryptoHash(password) === user.password) return done(null, user); //입력한 비밀번호와 디비저장비밀번호 검증
        else return done(null, false, { message : "패스포트중 비밀번호가 틀립니다."}); //임의 에러 처리

    });
}));

/* ========================
|| 로그인페이지 이동      ||
==========================*/
exports.loginPage = (req,res) => {
    console.log("로긴페이지 들어옴 ");
    res.render("users/login");
}
/* ========================
||      로그인 확인       ||
==========================*/
exports.isLoggdIn = (req,res,next) => {
    if(req.isAuthenticated()) {  //로그인 되었다면 true로 다음 파이프라인으로 진행
        console.log("로그인 되어있다")
        return next();
    } else {
        console.log("로그인 안되어 있다.")
        res.redirect("/users/login")  //비로그인 시 /login 으로
    }
}
/* ========================
||       jwt 발급         ||
==========================*/
exports.login = (req,res,next) => {

    const username = req.body.username;
    const password = req.body.password;
    /* 주석처리 된 부분은 passport-local 부분에서
       인증처리 하므로 제거 하였슴.
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
     */

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
                        return res.json({message : "토큰발급성공",token});

                    } //else
                });
};


/* ========================
||       이메일검증       ||
==========================*/
exports.verifyEmail = (req,res,next) => {
    let email = req.body.email;

    let transportor = nodeMailer.createTransport({ //메일발송객체 생성
        service : "gmail",
        auth    : {
            user : process.env.GMAIL_ACCOUNT,         //gmail 계정 아이디
            pass : process.env.GMAIL_PASSWORD         //gmail 계정 비밀번호
        }
    });

    let mailOption = {
        from    : "anstnsp1@gmail.com", //발송 메일 주소 (위에 작성한 gmail 아이디)
        to      : email,                //수신 메일 주소
        subject : "안녕하세요 문슈's 입니다. 이메일 인증을 해주세요.",  // 제목
        html    : '<p>아래의 링크를 클릭해주세요 !</p>' +
            "<a href='http://localhost:7777/auth/?email="+ email +"&token=abcdefg'>인증하기</a>"


    };

    transportor.sendMail(mailOption, (err,info) => {
        if (err) {
            console.log(err);
        } else {
            console.log("email send Success!!" + info.response);
        }
    });

}
exports.confirmEmail = (req,res,next) => {
    let email2 = req.query.email;
    let token = req.query.token;
    console.log(req.email)
    console.log(req.token)
    console.log(email2);
    console.log(token)
    if(req.email === email2 && req.token === token) next();
}
/* ========================
||      토큰검증         ||
==========================*/
exports.validtionToken = (req, res, next) => {
    const token = req.headers["accesstoken"];
    if (typeof token !== "undefined") {
        req.accessToken = token;
    } else {
        req.accessToken = "";
    }
    next();
};

/* ========================
||      hash암호화        ||
==========================*/
encryptoHash = (password) => {
    let hash = crypto.createHash("sha256");
    hash.update(password);
    let hash_password = hash.digest("hex");
    return hash_password;

}
