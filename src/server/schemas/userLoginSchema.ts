import { Joi } from "express-validation";

const userLoginSchema = {
  body: Joi.object({
    user: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }).required(),
  }).required(),
};

export default userLoginSchema;
