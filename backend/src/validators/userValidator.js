import joi from "joi";

export const validUserSchema = joi.object({
  username: joi.string().required().alphanum().min(4).max(30),
  firstname: joi.string().required().min(1).max(20),
  lastname: joi.string().required().min(1).max(20),
  password: joi.string().required().strip(),
  email: joi.string().required().email({ minDomainSegments: 2 }),
});
