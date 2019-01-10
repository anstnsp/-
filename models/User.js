// models/User.js
const mongoose = require("mongoose");

// schema // 1
const userSchema = mongoose.Schema({
 username:{type:String, required:[true,"Username is required!"], unique:true},
 password:{type:String, required:[true,"Password is required!"], select:false},
 name:{type:String, required:[true,"Name is required!"]},
 email:{type:String}
},{
 toObject:{virtuals:true}
});
/*
1. schema : require 에 true 대신 배열이 들어갔습니다. 첫번째는 true/false 값이고, 두번째는 에러메세지입니다. 
그냥 true/false을 넣을 경우 기본 에러메세지가 나오고, 배열을 사용해서 custom(사용자정의) 에러메세지를 만들 수 있습니다.
password에는 select:false가 추가되었습니다. 기본설정은 자동으로 select:true인데, schema항목을 DB에서 읽어옵니다.
 select:false로 설정하면 DB에서 값을 읽어 올때 해당 값을 읽어오라고 하는 경우에만 값을 읽어오게 됩니다. 비밀번호는 중요하기 때문에 기본적으로 DB에서 값을 읽어오지 않게 설정했습니다. 
*/

// virtuals // 2
userSchema.virtual("passwordConfirmation")
.get(function(){ return this._passwordConfirmation; })
.set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual("originalPassword")
.get(function(){ return this._originalPassword; })
.set(function(value){ this._originalPassword=value; });

userSchema.virtual("currentPassword")
.get(function(){ return this._currentPassword; })
.set(function(value){ this._currentPassword=value; });

userSchema.virtual("newPassword")
.get(function(){ return this._newPassword; })
.set(function(value){ this._newPassword=value; });
/*
2. DB에 저장되는 값은 password인데, 회원가입, 정보 수정시에는 위 값들이 필요합니다. DB에 저장되지 않아도 되는 정보들은 virtual로 만들어 줍니다.
*/


// password validation // 3
userSchema.path("password").validate(function(v) {
 var user = this; // 3-1
/*
3. DB에 정보를 생성, 수정하기 전에 mongoose가 값이 유효(valid)한지 확인(validate)을 하게 되는데 password항목에 custom(사용자정의) validation 함수를 지정할 수 있습니다.
 virtual들은 직접 validation이 안되기 때문에(DB에 값을 저장하지 않으니까 어찌보면 당연합니다) password에서 값을 확인하도록 했습니다.
3-1. validation callback 함수 속에서 this는 user model입니다.
*/


 // create user // 3-3
 if(user.isNew){ // 3-2
  if(!user.passwordConfirmation){
   usertest.invalidate("passwordConfirmation", "Password Confirmation is required!");
  }
  if(user.password !== user.passwordConfirmation) {
   user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
  }
 }
/*
3-2. model.isNew 항목이 true이면 새로 생긴 model(DB에 한번도 기록되지 않았던 model) 즉, 새로 생성되는 user이며, 값이 false이면 DB에서 읽어 온 model 즉, 회원정보를 수정하는 경우입니다.
3-3. 회원가입의 경우 password confirmation값이 없는 경우, password와 password confirmation값이 다른 경우에 유효하지않음처리(invalidate)를 하게 됩니다.
 model.invalidate함수를 사용하며, 첫번째는 인자로 항목이름, 두번째 인자로 에러메세지를 받습니다.
*/

 // update user // 3-4
 if(!user.isNew){
  if(!user.currentPassword){
   user.invalidate("currentPassword", "Current Password is required!");
  }
  if(user.currentPassword && user.currentPassword != user.originalPassword){
   user.invalidate("currentPassword", "Current Password is invalid!");
  }
  if(user.newPassword !== user.passwordConfirmation) {
   user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
  }
 }
});
/*
3-4. 회원정보 수정의 경우 current password값이 없는 경우, current password값이 original password랑 다른 경우, new password 와 password confirmation값이 다른 경우 invalidate합시다. 
회원정보 수정시에는 항상 비밀번호를 수정하는 것은 아니기 때문에 new password와 password confirmation값이 없어도 에러는 아닙니다.
*/
// model & export
const User = mongoose.model("user",userSchema);
module.exports = User;