// models/Post.js

var mongoose = require("mongoose");

// schema
var postSchema = mongoose.Schema({ // 1
     title:{type:String, required:true},      //제목
     body:{type:String},                       //내용
     createdAt:{type:Date, default:Date.now},  // 게시일
     updatedAt:{type:Date, default: Date.now},                    //수정일
     username:{type:String, required:true},   //글쓴이
     postNo:{type:Number},                    //게시물번호
},{
 toObject:{virtuals:true} // 4
});

// virtuals // 3
postSchema.virtual("createdDate")
.get(function(){
 return getDate(this.createdAt);
});

postSchema.virtual("createdTime")
.get(function(){
 return getTime(this.createdAt);
});

postSchema.virtual("updatedDate")
.get(function(){
 return getDate(this.updatedAt);
});

postSchema.virtual("updatedTime")
.get(function(){
 return getTime(this.updatedAt);
});

// model & export
var Post = mongoose.model("post", postSchema);
module.exports = Post;

// functions
function getDate(dateObj){
 if(dateObj instanceof Date)
  return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth()+1)+ "-" + get2digits(dateObj.getDate());
}

function getTime(dateObj){
 if(dateObj instanceof Date)
  return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes())+ ":" + get2digits(dateObj.getSeconds());
}

function get2digits(num){
 return ("0" + num).slice(-2);
}