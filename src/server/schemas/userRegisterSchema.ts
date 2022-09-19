import { Joi } from "express-validation";

const userRegisterSchema = {
  body: Joi.object({
    user: Joi.object({
      name: Joi.string().min(3).max(20).required(),
      email: Joi.string().min(3).max(50).required(),
      password: Joi.string().min(6).required(),
    }).required(),
  }),
};

export default userRegisterSchema;
