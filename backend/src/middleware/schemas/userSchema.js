const joi = require("joi");

const userSchema = joi.object({
  username: joi.string().required().alphanum().min(4).max(30),
  firstname: joi.string().required().min(1).max(20),
  lastname: joi.string().required().min(1).max(20),
  password: joi.string().strip().required().min(8),
  email: joi.string().required().email({ minDomainSegments: 2 }),
  mailing: joi.boolean().required(),
});

const loginSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().strip().required(),
});

module.exports = { userSchema, loginSchema };
