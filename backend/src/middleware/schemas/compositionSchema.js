const joi = require("joi");

const compositionSchema = joi.object({
  title: joi.string().required().default("Untitled Composition").min(1).max(30),
});

module.exports = compositionSchema;
