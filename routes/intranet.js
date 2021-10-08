const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User and Post model in order to interact with the database
const User = require("../models/User.model");
const Post = require("../models/Post.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

router.get("/admin-dashboard", isLoggedIn, isAdmin, (req, res) => {
  Post.find()
    .populate([{ path: "postUserId" }])
    .then((allPosts) => {
      console.log(allPosts);
      res.render("intranet/admin-dashboard", { userPosts: allPosts });
    });
});

module.exports = router;
