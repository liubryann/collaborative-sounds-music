export const isAuthenticated = function (req, res, next) {
  if (!req.session.user)
    return res.status(401).json({ error: "Not Authenticated" });
  next();
};
