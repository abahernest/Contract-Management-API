const Joi = require("joi");

module.exports.validateNewContract = function (req, res, next) {
  const schema = Joi.object({
    userID: Joi.string().uuid().required(),
    templateID: Joi.string().uuid().required(),
    contractName: Joi.string().required(),
  }).options({ allowUnknown: true });

  const response = schema.validate(req.event.body);
  if (response.error) {
    return res.badRequest(JSON.stringify({
      status: 400,
      error: true,
      message: response.error.message,
    }));
  }
  return next();
};

module.exports.validateFetchByIdQuery = function (req, res, next) {
  const schema = Joi.object({
    id: Joi.string().uuid().required(),
  }).options({ allowUnknown: true });

  if (req.event.queryStringParameters){
    const response = schema.validate(req.event.queryStringParameters);
    if (response.error) {
        return res.badRequest(JSON.stringify({
        status: 400,
        error: true,
        message: response.error.message,
        }));
    }
  }
  return next();
};
