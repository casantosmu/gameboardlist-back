import { Joi } from "express-validation";

const postGameboardSchema = {
  body: Joi.object({
    image: Joi.string(),
    imageBackup: Joi.string(),
    rating: Joi.number().integer().min(1).max(10),
    weight: Joi.number().integer().min(1).max(5),
    name: Joi.string().min(1).max(100),
    year: Joi.number().min(1).max(3000),
    category: Joi.string(),
    players: Joi.object({
      min: Joi.number().min(1).max(50),
      max: Joi.number().min(1).max(50),
    }),
    time: Joi.object({
      min: Joi.number().min(1).max(1200),
      max: Joi.number().min(1).max(1200),
    }),
    authorship: Joi.string().max(100),
    createdBy: Joi.string(),
  }).required(),
};

export default postGameboardSchema;
