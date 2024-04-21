const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const MessageSchema = new Schema({
    author: {
        type: String,
    },
    message:{
        type: String,
    },
    extraInfo: {
        type: String
    }
},{
    timestamps:true
})


const Message = mongoose.model('Message',MessageSchema);
module.exports = Message;