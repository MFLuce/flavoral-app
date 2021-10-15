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

//NODEMAILER
const nodemailer = require("nodemailer");

//ADMIN DASHBOARD ROUTES
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
          return { ...thePost.toJSON(), formatdate };
        });
        res.render("intranet/admin-dashboard", {
          userPosts: postDate,
          companyUsers,
        });
      });
    });
});

// ASSIGN POST ROUTES
router.post("/:id/assign", isLoggedIn, isAdmin, PostMiddleware, (req, res) => {
  const { assignedTo } = req.body;

  return Post.findByIdAndUpdate(req.post._id, { assignedTo }, { new: true })
    .populate("postUserId assignedTo")
    .then((assignedPost) => {
      const formatDate = formatedDate(req.post.created);
      res.render("intranet/assign", {
        post: assignedPost,
        created: formatDate,
      });
    });
});

//SEND ASSIGNED POST TO THE COMPANY USER
router.post("/:id/assign/send", isAdmin, PostMiddleware, (req, res) => {
  const { category, postText, companyName, name, created, assignedTo } =
    req.body;

  // User.findById(req.post.assignedTo._id).then((assignedUser) => {
  //   //Check if the assignedTo is a company person
  if (!req.post.assignedTo.isCompany) {
    return res.redirect("/intranet/admin-dashboard");
  }
  //Check if the assignedTo has an email
  if (!req.post.assignedTo.email) {
    return res.status(400).render(`intranet/${req.params.id}/assign`, {
      errorMessage: "The assigned person doesn't have an email.",
    });
  }

  //Format Date to DD/MM/YYYY
  const formatDate = formatedDate(req.post.created);

  //Nodemailer execution
  // 1. Create a Nodemailer transporter using either SMTP or some other transport mechanism
  const transport = nodemailer.createTransport({
    //I put the emailtrap parameters than I found on my account
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.EMAIL_TEST,
      pass: process.env.PW_TEST,
    },
  });

  const message = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style>
        body {
          font-family: sans-serif;
        }
  
        p {
          margin: 2rem auto 0;
          text-align: center;
          max-width: 40ch;
        }
  
        h1,
        footer {
          text-align: center;
        }
  
        footer {
          margin-top: 2rem;
          background: #000;
          color: white;
          padding: 1.5rem;
        }
      </style>
    </head>
    <body>
      <h1>AMINE YOU HAVE A NEW ASSIGNED POST !</h1>
  
      <form>
          <fieldset>
              <legend class="h2">Details of the Post</legend>
              <label>Category</label>
              <input
                type="text"
                name="category"
                value= ${req.post.category}
                readonly
              />
              <br/>
  
              <label>Question</label>
              <textarea
                rows="5"
                cols="30"
                name="postText"
                readonly
              >${req.post.postText}</textarea>
              <br/>
  
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value=${req.post.postUserId.companyName}
                readonly
              />
              <br/>
  
              <label>Name</label>
              <input
                type="text"
                name="name"
                value=${req.post.postUserId.userName}
                readonly
              />
              <br/>
  
              <label>Email</label>
              <input
                type="text"
                name="email"
                value=${req.post.postUserId.email}
                readonly
              />
              <br/>
  
              <label>Phone Number</label>
              <input
                type="number"
                name="phoneNumber"
                value=${req.post.postUserId.phoneNumber}
                readonly
              />
              <br/>
  
              <label>Location</label>
              <input
                type="text"
                name="location"
                value=${req.post.postUserId.location}
                readonly
              />
              <br/>
  
              <label>Business</label>
              <input
                type="text"
                name="business"
                value=${req.post.postUserId.business}
                readonly
              />
              <br/>
  
              <label>Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value=${req.post.postUserId.jobTitle}
                readonly
              />
              <br/>
  
              <label>Date</label>
              <input 
              type="text" 
              name="created" 
              value=${formatDate} 
              readonly
              />
              <br/>
  
              <label>Assigned to</label>
              <input
                type="text"
                name="assignedTo"
                value=${req.post.assignedTo.userName}
                readonly
              />
              <br/>
              <br/>
      </form>
      
      <footer>Nodemailer | 2021</footer>
    </body>
  </html>
  `;

  transport
    .sendMail({
      from: '"Fred Foo 👻" <sendersaddress@here.com>', // sender address
      to: "receiversaddress@here.com", // list of receivers
      subject: "WE ARE ALIVE! 🔥", // Subject line
      text: "Hello world?", // plain text body
      html: message, // html body
    })
    .then((ok) => console.log("ok", ok))
    .catch((err) => console.log("error: ", err.message));

  // });
  res.redirect("/intranet/admin-dashboard");
});

module.exports = router;
