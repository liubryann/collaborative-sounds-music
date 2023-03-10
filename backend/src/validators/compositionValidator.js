const joi = require("joi");

export const validCompositionSchema = joi.object({
  name: joi.string().default("Untitled Composition"),
  owner: joi.string().required().alphanum().min(4).max(30),
  collaborators: joi.array().items(joi.string()),
});
