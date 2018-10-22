const express = require(`express`);
const app = express();
const mongoose = require(`mongoose`);
const port = process.env.PORT || 5000;
const db = require("./config/keys.js").mongoURI;

const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(db)
  .then(() => console.log("connected successfully"))
  .catch(err => console.log(err));

// use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

app
  .get("/", (req, res) => {
    res.send("test successful");
  })
  .listen(port, () => {
    console.log(`server is running on ${port}`);
  });
