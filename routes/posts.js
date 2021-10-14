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
  res.render("posts/post-create", { category: postModelCategoryEnum });
});

router.post("/create", isLoggedIn, (req, res) => {
  const { category, postText } = req.body;

  Post.create({ category, postText, postUserId: req.session.user._id }).then(
    () => {
      res.redirect("/profile/profile-home");
    }
  );
});

//EDIT POST ROUTES
router.get("/:id/edit", isLoggedIn, isNotAdmin, PostMiddleware, (req, res) => {
  // I DON'T UNDERSTAND THE ????
  // if (!compareIds(req.session.user._id, req.post?.postUserId?._id)) {
  //   return res.redirect(`/profile/profile-home`);
  // }
  // console.log(post);
  // res.render("posts/edit-single-post", { post: req.post });

  // First check if the user is the writer of the post:
  if (!compareIds(req.session.user._id, req.post.postUserId._id)) {
    return res.redirect("/profile/profile-home");
  }
  const formatDate = formatedDate(req.post.created);

  const otherCategories = postModelCategoryEnum.filter(
    (cat) => cat !== req.post.category
  );

  res.render("posts/edit-single-post", {
    post: req.post,
    category: otherCategories,
    created: formatDate,
  });
});

router.post("/:id/edit", isLoggedIn, isNotAdmin, PostMiddleware, (req, res) => {
  const { category, postText } = req.body;

  if (!compareIds(req.session.user._id, req.post.postUserId._id)) {
    return res.redirect("/profile/profile-home");
  }

  return Post.findByIdAndUpdate(req.post._id, { category, postText }).then(
    () => {
      res.redirect("/profile/profile-home");
    }
  );
});

module.exports = router;
