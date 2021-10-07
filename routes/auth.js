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
const isAdmin = require("../middleware/isAdmin");

// SIGN UP ROUTES
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
  const {
    companyName,
    userName,
    location,
    email,
    phoneNumber,
    password,
    jobTitle,
    business,
  } = req.body;

  if (!companyName) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide your company name.",
      ...req.body,
    });
  }
  if (!userName) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide your name.",
      ...req.body,
    });
  }
  if (!email) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide your email.",
      ...req.body,
    });
  }
  if (!phoneNumber) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide your phone number.",
      ...req.body,
    });
  }

  /*   if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
      ...req.body,
    });
  } */

  //   ! This use case is using a regular expression to control for special characters and min length

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
      ...req.body,
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email }).then((foundUser) => {
    // If the email is found, send the message email is taken
    if (foundUser) {
      return res.status(400).render("auth/signup", {
        errorMessage: "This email is already taken.",
        ...req.body,
      });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          companyName,
          userName,
          location,
          email,
          phoneNumber,
          jobTitle,
          business,
          password: hashedPassword,
        });
      })
      .then((createdUser) => {
        // Bind the user to the session object
        req.session.user = createdUser;
        res.redirect("/profile/profile-home");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/signup", {
            errorMessage:
              "Email need to be unique. The email you chose is already in use.",
          });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});

// LOGIN ROUTES
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .render("auth/login", { errorMessage: "Please provide your email." });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("auth/login", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((foundUser) => {
      // If the email isn't found, send the message that user provided wrong credentials
      console.log(foundUser);
      if (!foundUser) {
        return res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
      }

      // If user is found based on the email, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, foundUser.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("auth/login", { errorMessage: "Wrong credentials." });
        }
        if (foundUser.isAdmin) {
          req.session.user = foundUser;
          return res.redirect("/intranet/admin-dashboard");
        }
        req.session.user = foundUser;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/profile/profile-home");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

module.exports = router;
