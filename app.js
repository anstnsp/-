/* ========================
||  환경설정 파일명 선택 ||
==========================*/
let envFileName = '.env-local';
if (process.argv.length >= 3 && (process.argv[2] === 'dev' || process.argv[2] === 'prod')) {
    envFileName = '.env-' + process.argv[2];
    process.profile = process.argv[2];
} else {
    process.profile = 'local';
}

console.log("Server Environment => ", process.profile);
/* ========================
||    LOAD THE CONFIG     ||
==========================*/
require("dotenv").config({path:__dirname + "/" + envFileName});
console.log(__dirname+"/"+envFileName);
/* ========================
||  LOAD THE DEPENDENCIES ||
==========================*/
const express = require("express");
const app = express();
const port = process.env.PORT || 7777;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const methodOverriide = require("method-override");
const session = require("express-session");
const passport = require("passport");



/* ===========================
|| CONNECT TO MONGODB SERVER ||
=============================*/
console.log(process.env.MONGODB_URL);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser : true});
const db = mongoose.connection;
db.once('open', ()=>{
  console.log("DB connected!!");
});
db.on("error", (err)=>{
  console.log("DB ERROR :", err);
});



//static폴더 지정
app.use(express.static(__dirname + "/public"));

// view engine setup
//app.set()을 이용해서 express의 세팅을 할 수 있다.
app.set('views', path.join(__dirname, 'views'));
console.log(__dirname+"\views");
app.set('view engine', 'ejs');


/* ========================
||    미들웨어           ||
==========================*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type, x-access-token'); //jwt로 생성된 토큰은 header의 x-access-token 항목을 통해 전달된다.
    next();
});
app.use(methodOverriide("_method"));
//resave 세션아이디를 접속할때마다 발급.(true)
app.use(session({   secret: '비밀코드', //세션 설정할때 key 아무거나 길게 쓰고 주기적으로 바꿔야함
                    resave: false,     //세션을 저장하는 방법이 여러가지인데(redis,mongodb 등등) 저장하고 불러오는 과정에서 세션을 다시 저장할건지 설정
                    saveUninitialized: false, // 세션을 저장할때 초기화 해줄지 선택
                    cookie: { maxAge : 360000, httpOnly : true},
                    rolling: true })); //처음 로그인 했을때 세션이 저장 되는데 로그인상태에서 다른 페이지로 이동할 때마다,세션값에 변화를 줄건지(maxAge나 expire시간) 설정
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 로그인 세션 유지


//라우팅
app.use("/", require("./router/home"));
app.use("/user", require("./router/user"));
app.use("/posts", require("./router/post"));
app.use("/auth", require("./router/auth"));   //인증관련 [jwt] , //로그인 [passport]

//404에러 발생시
app.use( (req,res,next) => {
    let err = new Error('NOT FOUND');
    err.status = 404;
    next(err);
});

//개발환경일때 에러 핸들러
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//운영일때 에러 핸들러
app.use((err,req,res,next) => {
    res.status(err.status || 500);
    res.render("error", {
        message : err.message,
        error : err
    })
});

app.listen(port, err =>{
  if(err) console.log(err);
  else console.log("Server is running at 7777 port!!");
})


module.exports = app;