require("dotenv").config();
const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
  {
    username: "malen",
    title: "Post 1",
  },
  {
    username: "jorjo",
    title: "Post 2",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  console.log(req.user.name);
  res.json(posts.filter((post) => post.username === req.user.name));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Token", token);
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // you have a token but is no longer valid
    req.user = user;
    console.log("User", req.user);
    next();
  });
}

app.listen(3000);
