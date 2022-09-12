import { Joi } from "express-validation";

const userLoginSchema = {
  body: Joi.object({
    user: Joi.object({
      email: Joi.string(),
      password: Joi.string(),
    }).required(),
  }),
};

export default userLoginSchema;
