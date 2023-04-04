const joi = require("joi");

const isRequestValid = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message.replace(/"/g, ""))
      .join(",");
    return res.status(422).json({ error: errorMessage });
  }
  next();
};

module.exports = isRequestValid;
