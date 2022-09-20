const { v4: uuid4} = require("uuid");
const dynamoose = require("dynamoose")

const logger = require('../../config/logger.js')
const {User, comparePassword, verifyAuthToken, generateJWToken} = require("../models/user.model.js");

/**
 * User Signup
 *
 * @param {any} req - javascript request object
 * @param {any} res - javascript response object
 * @returns {any} - {code, status, error, message, data}
 */
module.exports.Signup = async (req,res)=>{
  try {
    // Check that user email is unique
    const { email, fullname, password } = req.event.body
    const userID = uuid4();

    let user = await User.query(new dynamoose.Condition().where("email").eq(email)).exec()

    if (user.length !== 0){
        return res.send(
          400,
          JSON.stringify({
            code: 400,
            error: true,
            message: "Email already exists",
          })
        );
    }

    user = await User.create({userID, email, fullname, password })

    const token = generateJWToken(user);

    return res.send(200,
        JSON.stringify({
        code: 200,
        error: false,
        data: {
            token, 
            user: {email: user.email, fullname: user.fullname}
        }})
    );
    
  } catch (err) {
    logger.error(err)
    return res.send(500,JSON.stringify({
      code: 500,
      error: true,
      message: err.message,
    }))
  }
}

/**
 * User Login
 *
 * @param {any} req - javascript request object
 * @param {any} res - javascript response object
 * @returns {any} - {code, status, error, message, data}
 */
module.exports.Login = async (req,res) =>{
  try {
    const { email, password } = req.event.body

    // Validate email
    const user = await User.query(new dynamoose.Condition().where("email").eq(email)).exec()
    if (user.length != 1) {
      return res.send(400, JSON.stringify({
        status: 400,
        error: true,
        message: 'wrong credentials',
      }))
    }

    const isValidPassword = comparePassword(password, user[0].password)
    if (!isValidPassword) {
      return res.send(400,JSON.stringify({
        code: 400,
        status: 'failed',
        error: true,
        message: 'wrong credentials',
      }))
    }

    const token = generateJWToken(user[0])

    return res.send(200, JSON.stringify({
      stauus: 200,
      error: false,
      data: {
        token,
        user: { email: user[0].email, fullname: user[0].fullname}
      }})
    )
  } catch (err) {
    logger.error(err)
    return res.send(500,JSON.stringify({
      status: 500,
      error: true,
      message: err.message,
    }))
  }
}


