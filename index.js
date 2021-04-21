const express = require('express');
const app = express();
const port = 3000;
// var bodyParser = require('body-parser');
const { User } = require("./models/User");
const mongoose = require('mongoose');

const config = require('./config/key');

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

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

app.post('/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err});
    return res.status(200).json({success: true});
  });


});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

