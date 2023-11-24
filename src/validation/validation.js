import Joi from 'joi';

const bookValidation = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required(),

  author: Joi.string().min(2).max(100).required(),
  summary: Joi.string().min(2).max(500),
  publisher: Joi.string().min(2).max(100).required(),
  pageCount: Joi.number().integer().min(1).max(500).required(),
  readPage: Joi.number().integer().min(0).max(Joi.ref('pageCount')).required(),
  reading: Joi.boolean().required(),
});

export default bookValidation;
