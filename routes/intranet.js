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
const PostMiddleware = require("../middleware/PostMiddleware");
const formatedDate = require("../utils/formatedDate");

router.get("/admin-dashboard", isLoggedIn, isAdmin, (req, res) => {
  //1) Query the DB and get us all the users in
  // which the property isCompany === true!

  // 2) Send those usersnames to the HBS file

  Post.find({ assignedTo: null })
    .populate([{ path: "postUserId" }])
    .then((allPosts) => {
      // console.log(allPosts);

      User.find({ isCompany: true }).then((companyUsers) => {
        // console.log(companyUsers);
        res.render("intranet/admin-dashboard", {
          userPosts: allPosts,
          companyUsers,
        });
      });
    });
});

router.post("/:id/assign", isLoggedIn, isAdmin, PostMiddleware, (req, res) => {
  const { assignedTo } = req.body;
  console.log(`Here the req.body: `, req.body);
  return Post.findByIdAndUpdate(
    req.post._id,
    { assignedTo },
    { new: true }
  ).then(() => {
    console.log(`Here the req.post: `, req.post);
    res.render("intranet/assign", { post: req.post });
    console.log(req.post);
  });
});

module.exports = router;
