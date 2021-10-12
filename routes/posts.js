const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require the Post model in order to interact with the database
const Post = require("../models/Post.model");
const { postModelCategoryEnum } = require("../utils/consts");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const PostMiddleware = require("../middleware/PostMiddleware");
const isAdmin = require("../middleware/isAdmin");
const isNotAdmin = require("../middleware/isNotAdmin");
const compareIds = require("../utils/compareIds");
const formatedDate = require("../utils/formatedDate");

//CREATE POSTS ROUTES
router.get("/create", isLoggedIn, (req, res) => {
  // console.log(postModelCategoryEnum[0]);

  res.render("posts/post-create", { category: postModelCategoryEnum });
});

router.post("/create", isLoggedIn, (req, res) => {
  const { category, postText } = req.body;
  console.log(req.body);

  Post.create({ category, postText, postUserId: req.session.user._id }).then(
    (createdPost) => {
      console.log(createdPost);
      res.redirect("/profile/profile-home");
    }
  );
});

//EDIT SINGLE POST ROUTES
router.get("/:id/edit", isLoggedIn, isNotAdmin, (req, res) => {
  // I DON'T UNDERSTAND THE ????
  // if (!compareIds(req.session.user._id, req.post?.postUserId?._id)) {
  //   return res.redirect(`/profile/profile-home`);
  // }
  // console.log(post);
  // res.render("posts/edit-single-post", { post: req.post });

  Post.findById(req.params.id).then((editedPost) => {
    // First check if the user is the writer of the post:
    if (!compareIds(req.session.user._id, editedPost.postUserId._id)) {
      return res.redirect("/profile/profile-home");
    }

    const otherCategories = postModelCategoryEnum.filter(
      (cat) => cat !== editedPost.category
    );

    res.render("posts/edit-single-post", {
      post: editedPost,
      category: otherCategories,
    });
  });
});

// EDIT POST ROUTE BELOW

module.exports = router;
