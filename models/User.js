const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

// 보안이 필요한 부분 암호화
userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        // 비밀번호 이외의 것 변경시 빠져나오기 위함
        next();
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword가 암호화된 비밀번호와 같은지 체크하기 위하여 plainPassword를 암호화한 뒤 비교
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        else cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function(cb) {
    // jsonwebtoken 이용해 토큰 생성
    var user = this;

    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        else cb(null, user);
    });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };