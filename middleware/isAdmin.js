module.exports = (req, res, next) => {
  // checks if the user is Admin or not when trying to access a specific page
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }

  if (!req.session.user.isAdmin) {
    return res.redirect("/");
  }
  req.user = req.session.user;

  next();
};
