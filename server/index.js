const express = require('express');
const app = express();
const port = 3000;
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const mongoose = require('mongoose');
const config = require('./config/key');
const cookieParser = require('cookie-parser');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World! 안녕');
});

// 데이터저장
app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

// 로그인기능
app.post('/api/users/login', (req, res) => {

  // 요청된 이메일 DB에서 찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일이 일치하지 않습니다."
      });
    }

    // 요청된 이메일이 DB에 있다면, 비밀번호 일치 여부 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 일치하지 않습니다." });

      // 비밀번호가 일치하면, 토큰 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 쿠키에 토큰 저장
        res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

