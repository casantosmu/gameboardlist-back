import { Joi } from "express-validation";

const userRegisterSchema = {
  body: Joi.object({
    user: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required().min(3).max(50),
      password: Joi.string().required().min(6),
    }).required(),
  }),
};

export default userRegisterSchema;
