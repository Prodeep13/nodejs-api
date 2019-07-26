const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/final', {useNewUrlParser: true, useCreateIndex: true,});
var conn = mongoose.Collection;
var userSchema = new mongoose.Schema({
    firstname: { type: String,
        required: true,
        index: {
                unique: true,
        }},

     lastname: { type: String,
            required: true,
            index: {
                    unique: true,
            }},

     contact: { type: Number,
                  required: true,
                 index: {
                        unique: true,
                }},

    email: {
        type:String,
        required: true,
        index: {
            unique: true,
        }},

    password: {
                type:String,
                required: true,
                 },

    date: {
                    type:Date,
                    default: Date.now}
});

var userModel  = mongoose.model('users', userSchema);
module.exports = userModel;