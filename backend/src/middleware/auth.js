export const isAuthenticated = function (req, res, next) {
  if (!req.session.user) res.status(401).json({ error: "Unauthorized" });
  next();
};
