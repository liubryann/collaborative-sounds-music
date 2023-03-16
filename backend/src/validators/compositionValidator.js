import joi from "joi";

export const validCompositionSchema = joi.object({
  title: joi.string().required().default("Untitled Composition").min(1).max(30),
});
