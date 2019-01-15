const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
	
	log: String,
    date: String
    
});

// 컬렉션 생성
const Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;
