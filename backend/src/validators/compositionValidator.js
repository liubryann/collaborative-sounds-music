const joi = require("joi");

const validCompositionSchema = joi.object({
  title: joi.string().required().default("Untitled Composition").min(1).max(30),
});

module.exports = { validCompositionSchema };
