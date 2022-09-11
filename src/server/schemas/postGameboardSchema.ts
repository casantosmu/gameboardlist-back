import { Joi } from "express-validation";

const postGameboardSchema = {
  body: Joi.object({
    image: Joi.string().required(),
    imageBackup: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(10).required(),
    weight: Joi.number().integer().min(1).max(5).required(),
    name: Joi.string().min(1).max(100).required(),
    year: Joi.number().min(1900).max(3000).required(),
    category: Joi.string().required(),
    players: Joi.object({
      min: Joi.number().min(1).max(50).required(),
      max: Joi.number().min(1).max(50).required(),
    }).required(),
    time: Joi.object({
      min: Joi.number().min(1).max(1200).required(),
      max: Joi.number().min(1).max(1200).required(),
    }).required(),
    authorship: Joi.string().max(100),
    createdBy: Joi.string().required(),
  }).required(),
};

export default postGameboardSchema;
