const {create, jsonMiddleware} = require("slspress");

// Middlewares
const {validateLogin,validateSignup} = require("./api/middleware/validations/auth.validators.js");
const { validateFetchByIdQuery, validateNewContract } = require("./api/middleware/validations/contract.validators.js");

const {Protected} = require("./api/middleware/auth/auth.js")

// controller
const {
  FetchAll,
  FetchById,
  NewContract,
} = require("./api/controller/contract.controller.js");
const { 
  Signup, 
  Login 
} = require("./api/controller/auth.controller.js");


// config
const connectToDB = require("./config/dynamoose.js");
const logger = require("./config/logger.js");

const { final, response } = require("slspress/lib/config/route-config-wrappers.js");

try{
  connectToDB();
  logger.info("connected to database")
}catch(err){
  logger.error(err)
  process.exit()
}

const handler = create();

handler.middleware(jsonMiddleware)

handler
  .on("signup")
  .middleware(validateSignup)
  .post("/signup", Signup)

handler
  .on("signin")
  .middleware(validateLogin)
  .post("/signin", Login);

handler
  .on("allcontracts")
  .middleware(Protected)
  .get("/getcontractids", FetchAll)

handler
  .on("singlecontract")
  .middleware(validateFetchByIdQuery)
  .middleware(Protected)
  .get("/getcontract", FetchById)

handler
  .on("newcontract")
  .middleware(validateNewContract)
  .middleware(Protected)
  .post("/createcontract", NewContract);

module.exports = handler.export()
