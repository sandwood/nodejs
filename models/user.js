// 1. userSchema
// 2. User 모델생성
// 3. modules.exports = User


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");

var userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String
});

// User.authenticate
userSchema.statics.authenticate = function(username, password, callback){
    var mongoQuery = { username: username};
    User.findOne(mongoQuery, function(err, user){
        if(err) return callback(err);
        if(!user){
            var err = new Error('User matched not found.');
            return callback(err);
        }
        bcrypt.compare(password, user.password, function(err, result){
            if(err) return callback(err);
            if(!result){
                var err = new Error('Password not matched');
                return callback(err);
            }
            return callback(null, user);
        })
    });
}

userSchema.pre('save', function(next){
    var user = this;
    
    bcrypt.hash(user.password, 10, function(err, hash){
        if(err) return next(err);
        
        var newPassword = hash;
        user.password = newPassword;
        
        return next();
    })
});

var User = mongoose.model('User', userSchema);

module.exports = User;