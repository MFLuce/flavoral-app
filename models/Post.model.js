const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const { postModelCategoryEnum } = require("../utils/consts");

// TODO: Please make sure you edit the post model to whatever makes sense in this case
const postSchema = new Schema({
  postUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postText: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: postModelCategoryEnum,
    /**
     * enum: checks if the value is one of the following:
     * -> "Commercial"
     * -> "Technical Information"
     * -> "General Information"
     * -> "Accounting"
     */
  },
  created: {
    type: Date,
    default: Date(),
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
});

const PostModel = model("Post", postSchema);

module.exports = PostModel;
