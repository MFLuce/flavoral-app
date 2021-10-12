const Post = require("../models/Post.model");
module.exports = (req, res, next) => {
  Post.findById(req.params.id)
    .populate([{ path: "postUserId" }, { path: "assignedTo" }])
    .then((singlePost) => {
      if (!singlePost) {
        return res.redirect("/");
      }

      req.post = singlePost;

      next();
    });
};
