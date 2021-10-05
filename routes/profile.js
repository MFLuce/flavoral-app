const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const PostModel = require("../models/Post.model");

//PROFILE ROUTES
router.get("/profile-home", isLoggedIn, (req, res) => {
  PostModel.find({ postUserId: req.session.user._id }).then((userPosts) => {
    res.render("profile/profile-home", { userPosts });
  });
});

//UPDATE PROFILE ROUTES
router.get("/update-profile", isLoggedIn, (req, res) => {
  res.render("profile/update-profile", {
    userName: req.session.user.userName,
    companyName: req.session.user.companyName,
    location: req.session.user.location,
    email: req.session.user.email,
    phoneNumber: req.session.user.phoneNumber,
    jobTitle: req.session.user.jobTitle,
    business: req.session.user.business,
  });
});

router.post("/update-profile", isLoggedIn, (req, res) => {
  const {
    userName,
    companyName,
    location,
    email,
    phoneNumber,
    jobTitle,
    business,
  } = req.body;
  User.findByIdAndUpdate(
    req.session.user._id,
    { userName, companyName, location, email, phoneNumber, jobTitle, business },
    { new: true }
  ).then((updatedUser) => {
    req.session.user = updatedUser;
    res.redirect("/profile/profile-home");
  });
});

//UPDATE PASSWORD ROUTES
router.get("/update-password", isLoggedIn, (req, res) => {
  res.render("profile/update-password");
});

router.post("/update-password", isLoggedIn, (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    return res.status(400).render("profile/update-password", {
      errorMessage: "Please provide a new password different from the old one.",
    });
  }

  //Compare the old password with the user password
  User.findById(req.session.user._id).then((user) => {
    const compPassword = bcrypt.compareSync(oldPassword, user.password);

    if (!compPassword) {
      return res.status(400).render("profile/update-password", {
        errorMessage: "Wrong credentials",
      });
    }

    //the new password should respect the password rules like in the signup form
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if (!regex.test(newPassword)) {
      return res.status(400).render("profile/update-password", {
        errorMessage:
          "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
    }
    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(newPassword, salt))
      .then((newHashedPassword) => {
        return User.findByIdAndUpdate(
          user._id,
          { password: newHashedPassword },
          { new: true }
        ).then((updatedUser) => {
          req.session.user = updatedUser;
          res.redirect("/profile/profile-home");
        });
      });
  });
});

module.exports = router;
