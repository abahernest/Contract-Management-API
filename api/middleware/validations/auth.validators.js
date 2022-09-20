const Joi = require('joi');


module.exports.validateSignup  = function (req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required()
        .min(8),
      fullname: Joi.string().required(),
    }).options({ allowUnknown: true });

    const response = schema.validate(req.event.body)
    if (response.error){
        return res.badRequest({
            status: 400,
            error: true,
            message: response.error.message
        })
    }
    return next()
}

module.exports.validateLogin = function (req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required()
      .min(8),
  }).options({ allowUnknown: true });
  
  const response = schema.validate(req.event.body);
  if (response.error) {
    return res.badRequest({
      status: 400,
      error: true,
      message: response.error.message,
    });
  }
  return next();
};
