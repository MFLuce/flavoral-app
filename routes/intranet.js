const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User and Post model in order to interact with the database
const User = require("../models/User.model");
const PostModel = require("../models/Post.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

router.get("/login", isLoggedOut, (req, res) => {
  res.render("intranet/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).render("intranet/login", {
      errorMessage: "Please provide your email.",
    });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("intranet/login", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ $and: [{ email: email }, { isAdmin: true }] })
    .then((foundAdmin) => {
      // If the email isn't found, send the message that user provided wrong credentials
      if (!foundAdmin) {
        return res
          .status(400)
          .render("intranet/login", { errorMessage: "Wrong credentials." });
      }

      // If user is found based on the email, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, foundAdmin.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("intranet/login", { errorMessage: "Wrong credentials." });
        }
        req.session.user = foundAdmin;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/intranet/admin-dashboard");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.get("/admin-dashboard", isAdmin, (req, res) => {
  PostModel.find().then((allPosts) => {
    res.render("intranet/admin-dashboard", { userPosts: allPosts });
  });
});

module.exports = router;
