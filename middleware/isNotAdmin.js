module.exports = (req, res, next) => {
  // checks if the user is Admin or not when trying to access a specific page
  if (req.session.user && req.session.user.isAdmin) {
    return res.redirect("/intranet/admin-dashboard");
  }
  req.user = req.session.user;

  next();
};
