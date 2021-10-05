// SET COMPANY USERS AND ADMIN
require("dotenv/config");

const companyAdmin = {
  companyName: process.env.COMPANY_NAME,
  userName: process.env.ADMIN_USERNAME,
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  phoneNumber: process.env.ADMIN_PHONE_NUMBER,
  isAdmin: true,
  isCompany: true,
};
const companyUsers = {
  companyName: process.env.COMPANY_NAME,
  userName: process.env.USER_USERNAME,
  email: process.env.USER_EMAIL,
  password: process.env.USER_PASSWORD,
  phoneNumber: process.env.USER_PHONE_NUMBER,
  isAdmin: false,
  isCompany: true,
};

// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");
const User = require("../models/User.model");

// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");
// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const { MONGO_URI } = require("../utils/consts");

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );

    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(companyAdmin.password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          //I create the Admin user
          companyName: companyAdmin.companyName,
          userName: companyAdmin.userName,
          email: companyAdmin.email,
          password: companyAdmin.password,
          phoneNumber: companyAdmin.phoneNumber,
          isAdmin: companyAdmin.isAdmin,
          isCompany: companyAdmin.isCompany,
          //Instead of writing this long object, I can use the spread operator:
          //   ...companyAdmin,
          password: hashedPassword,
        }).then(() => {
          return bcrypt
            .genSalt(saltRounds)
            .then((salt) => bcrypt.hash(companyUsers.password, salt))
            .then((hashedPassword) => {
              return User.create({
                ...companyUsers,
                password: hashedPassword,
              });
            });
        });
      });
  })

  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  })
  .finally(() => {
    mongoose.disconnect();
  });

//This line tells us what is going on Mongoose
//but when it's on Heroku, the variable will be production
//so all the logs concerning mongoose won't be executed
// Why we shouldn't execute logs in live app because it's consuming a lot of memory or space
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}
