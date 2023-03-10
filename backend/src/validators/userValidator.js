const joi = require("joi");

export const validUserSchema = joi.object({
  username: joi.string().required().alphanum().min(4).max(30),
  firstname: joi.string().required(),
  lastname: joi.string().required(),
  password: joi.string().required().strip(),
  email: joi.string().required().email({ minDomainSegments: 2 }),
  compositions: joi.array().items(joi.string()),
});
