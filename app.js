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
const express           = require("express");
const app               = express();
const fs                = require("fs");
const http              = require("http").Server(app);
const https             = require("https");
const HTTPPORT          = process.env.PORT || 7777;
const HTTPSPORT         = process.env.PORT || 443;
const bodyParser        = require("body-parser");
const mongoose          = require("mongoose");
const path              = require("path");
const methodOverriide   = require("method-override");
const session           = require("express-session");
const passport          = require("passport");
const io                = require("socket.io")(http); 
const secret            = "finger_pullkey";
const redis        = require("redis")
const Chat              = require("./models/Chat");
//https에 사용할 대칭키 파일
let options = {
    key : fs.readFileSync("./public/private.pem", "utf8"),
    cert : fs.readFileSync("./public/public.pem","utf8")
};
// REDIS (발행자, 구독자)
var subscriber = redis.createClient(14368,"redis-14368.c82.us-east-1-2.ec2.cloud.redislabs.com");
var publisher = redis.createClient(14368,"redis-14368.c82.us-east-1-2.ec2.cloud.redislabs.com");

subscriber.auth(process.env.REDIS_PASSWORD, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("subscriber redis 서버 연결 성공!")
    }
});
publisher.auth(process.env.REDIS_PASSWORD, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("publisher redis 서버 연결 성공!!")
    }
});
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

app.use((req,res,next)=> {
    //app.use에 있는 함수는 request가 올때마다 route에 상관없이 무조건 해당 함수가 실행됩니다.
    //res.locals에 담긴 변수는 ejs에서 바로 사용가능
    //res.locals.isAuthenticated는 ejs에서 user가 로그인 되어있는지 확인하는데 사용하고 
    //res.locals.currentUser 는 로그인된 user의 정보를 불러오는데 사용
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
})
//라우팅
app.use("/", require("./router/home"));
app.use("/user", require("./router/user"));
app.use("/posts", require("./router/post"));
app.use("/auth", require("./router/auth"));   //인증관련 [jwt] , //로그인 [passport]
app.use("/crawling", require("./router/crawling"));
app.use("/chat", require("./router/chat")); 

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
let users = [];
io.sockets.on('connection', function (socket) {
	// 최초 접속시 호출
	socket.on('chat_user', function (raw_msg) {
		var msg = JSON.parse(raw_msg);
		var channel = '';
		if(msg["channel"] != undefined) {
			channel = msg["channel"];
		}
		socket.emit('socket_evt_chat_user', JSON.stringify(users));
		
		Chat.find({}, function (err, logs) {
			socket.emit('socket_evt_logs', JSON.stringify(logs));
			socket.broadcast.emit('socket_evt_logs', JSON.stringify(logs));
		});
	});

	//사용자가 접속했을 때의 상황 처리
	socket.on('chat_conn', function (raw_msg) {
		var msg = JSON.parse(raw_msg);
		var channel = '';
		if(msg['channel'] != undefined) {
			channel = msg['channel'];
        }
       // SocketIO('workspace', msg.workspace);
		//socket.set('workspace', msg.workspace);
		var index = users.indexOf(msg.chat_id);
		if (index != -1) {
			socket.emit('chat_fail', JSON.stringify(msg.chat_id));
		} else {
			users.push(msg.chat_id);
			socket.broadcast.emit('chat_join', JSON.stringify(users));
			socket.emit('chat_join', JSON.stringify(users));
			let chat = new Chat();
			chat.log = msg.chat_id + ' 접속하셨습니다.';
			chat.date = getToday();
			chat.save(function (err) {
				if (err)
					return handleError(err);
				
                    Chat.find({}, function (err, logs) {
					socket.emit("socket_evt_logs", JSON.stringify(logs));
					socket.broadcast.emit("socket_evt_logs", JSON.stringify(logs));
				});
			});
		}
	});
	
	//사용자가 메시지를 보냈을 때의 상황 처리
	socket.on('message', function (raw_msg) {
		var msg = JSON.parse(raw_msg);
		var channel = '';
		if(msg['channel'] != undefined) {
			channel = msg['channel'];
		}
		if (channel == 'chat') {
			var chatting_message = msg.chat_id + ' : ' + msg.message;
			publisher.publish('chat', chatting_message);
		}
	});
	
	//사용자가 채팅방을 나갔을 때의 상황 처리
	socket.on('leave', function (raw_msg) {
		var msg = JSON.parse(raw_msg);
		if (msg.chat_id != '' && msg.chat_id != undefined) {
			var index = users.indexOf(msg.chat_id);
			socket.emit('someone_leaved', JSON.stringify(msg.chat_id));
			socket.broadcast.emit('someone_leaved', JSON.stringify(msg.chat_id));
			users.splice(index, 1);
			let chat = new Chat();
			chat.log = msg.chat_id + '님이 나가셨습니다.';
			chat.date = getToday();
			chat.save(function (err) {
				if (err)
					return handleError(err);
			
                    Chat.find({}, function (err, logs) {
					socket.emit('socket_evt_logs', JSON.stringify(logs));
					socket.broadcast.emit('socket_evt_logs', JSON.stringify(logs));
				});
			});
		}
		socket.emit('refresh_userlist', JSON.stringify(users));
		socket.broadcast.emit('refresh_userlist', JSON.stringify(users));
	});
	
	//구독자 객체가 메시지를 받으면 소켓을 통해 메시지를 전달
	subscriber.on('message', function (channel, message) {
		socket.emit('message_go', message);
	});
   
	//구독자 객체는 'chat'을 구독 시작
	subscriber.subscribe('chat');
}); 

// 현재 시간 얻기
function getToday() {
	var date = new Date();
	return date.getFullYear() +'.'+ (date.getMonth()+1) +'.'+ date.getDate() +' '+ date.getHours() +':'+ date.getMinutes() +':'+date.getSeconds();
}

// SOCKET 연결 끊어질 시 호출
io.sockets.on('close', function (socket) {
	subscriber.unsubscribe();
	publisher.close();
	subscriber.close();
});


//채팅서버 포트 => 3000
// http.listen(3000, function(){ //4
//     console.log('채팅서버 가동');
//   });


//http웹서버 포트 => 7777
http.listen(HTTPPORT, err =>{
  if(err) console.log(err);
  else console.log("Server is running at 7777 port!!");
})

//https웹서버 포트 => 443
// https.createServer(options, app).listen(port2, (err) => {
//     if(err) console.log(err);
//     else console.log("Server is running at 443 port!!");
// })

module.exports = app;