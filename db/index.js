// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const { MONGO_URI } = require("../utils/consts");

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })

  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

//This line tells us what is going on Mongoose
//but when it's on Heroku, the variable will be production
//so all the logs concerning mongoose won't be executed
// Why we shouldn't execute logs in live app because it's consuming a lot of memory or space
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}
