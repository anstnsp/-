const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({

    userID : {type:String, required:true, unique:true},
    password : String,
    userName : String,
    address : String,
    phoneNumber : String,
    email : String,
    create_Date : { type:Date, dedault:Date.now}
    
});
//model을 user로 만들면 특별한 이름을 지정하지 않아도
//mongoDB에서 알아서 Collection name을 복수로 만들어 준다.
//그리하여 Collection name은 users로 된다.
module.exports = mongoose.model('user',UserSchema);