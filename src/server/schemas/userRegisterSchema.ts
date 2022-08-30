import { Joi } from "express-validation";

const userRegisterSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().min(3).max(50),
    password: Joi.string().min(6),
  }),
};

export default userRegisterSchema;
