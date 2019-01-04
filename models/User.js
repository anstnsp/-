// models/User.js
const mongoose = require("mongoose");


// schema // 1
const userSchema = mongoose.Schema({
    username:{type:String, required:[true,"Username is required!"], unique:true},   //사람이름
    password:{type:String, trim:true},//required:[true,"Password is required!"] ,
    name:{type:String},                        //아이디
    email:{type:String},
    joinDate:{type:Date}, //가입일자
    accessToken : {type:String},//로컬토큰
    FBToken : {type:String},    //페북토큰
    KAKAOToken : {type:String}, //카카오토큰
    NAVERToken : {type:String},  //네이버토큰
    Provier : {type:String}    //정보제공자
});

/*
1. schema : require 에 true 대신 배열이 들어갔습니다. 첫번째는 true/false 값이고, 두번째는 에러메세지입니다. 
그냥 true/false을 넣을 경우 기본 에러메세지가 나오고, 배열을 사용해서 custom(사용자정의) 에러메세지를 만들 수 있습니다.
password에는 select:false가 추가되었습니다. 기본설정은 자동으로 select:true인데, schema항목을 DB에서 읽어옵니다.
 select:false로 설정하면 DB에서 값을 읽어 올때 해당 값을 읽어오라고 하는 경우에만 값을 읽어오게 됩니다. 비밀번호는 중요하기 때문에 기본적으로 DB에서 값을 읽어오지 않게 설정했습니다. 
*/




// model & export
const User = mongoose.model("user",userSchema);
module.exports = User;

//function
// encryptoHash = (password) => {
//     //비밀번호 hash암호화 하여 저장
//     let hash = crypto.createHash("sha256");
//     hash.update(password);
//     let hash_password = hash.digest("hex");
//
//     return hash_password;
// }