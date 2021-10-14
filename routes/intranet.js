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
      User.find({ isCompany: true }).then((companyUsers) => {
        const postDate = allPosts.map((thePost) => {
          const formatdate = formatedDate(thePost.created);
          console.log(thePost);
          console.log(formatdate);
          return { ...thePost.toJSON(), formatdate };
        });
        res.render("intranet/admin-dashboard", {
          userPosts: postDate,
          companyUsers,
        });
      });
    });
});

router.post("/:id/assign", isLoggedIn, isAdmin, PostMiddleware, (req, res) => {
  const { assignedTo } = req.body;

  return Post.findByIdAndUpdate(req.post._id, { assignedTo }, { new: true })
    .populate("postUserId assignedTo")
    .then((updatedPost) => {
      console.log(updatedPost);
      res.render("intranet/assign", { post: updatedPost });
    });
});

//SEND ASSIGNED POST TO THE COMPANY USER
router.post(
  "/:id/assign/send",
  isLoggedIn,
  isAdmin,
  PostMiddleware,
  (req, res) => {
    const { category, postText, companyName, name, created, assignedTo } =
      req.body;
    console.log(req.body);
  }
);

module.exports = router;
