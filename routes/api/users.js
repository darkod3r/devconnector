const express = require(`express`);
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already Exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: 200, //size
        r: "pg", //rating
        d: "mm" //default
      });

      const newUser = User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: avatar
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(400).json({ email: "email id not found" });
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // creating the payload
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };
        //creating JWT
        jwt.sign(payload, keys.secretKey, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else return res.status(400).json({ msg: "password is incorrect" });
    });
  });
});

module.exports = router;
