const Joi = require("joi");

exports.createPostValidation = Joi.object({
  post_name: Joi.string().min(3).required().messages({
    "string.empty": "Post name is required",
  }),

  description: Joi.string().required().messages({
    "string.empty": "Description is required",
  }),

  tags: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .optional(),

  post_image: Joi.string().optional(),
});
