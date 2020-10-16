const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 创建模型
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createTime: {
        type: Date,
        default: Date.now
    }
})

module.exports = UserSchema