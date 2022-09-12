import { Joi } from "express-validation";

const userRegisterSchema = {
  body: Joi.object({
    user: Joi.object({
      name: Joi.string().min(3).max(20),
      email: Joi.string().min(3).max(50),
      password: Joi.string().min(6),
    }).required(),
  }),
};

export default userRegisterSchema;
