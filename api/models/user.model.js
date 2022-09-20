const dynamoose = require("dynamoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const schema = new dynamoose.Schema({
    userID: {
        type: String,
        required: true,
        hashKey: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        set:(value)=>{
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(value, salt);
            return hash;
        }
    }
},{ timestamps: true })

module.exports.User = dynamoose.model("User",schema);



  /**
   * Compare argument with Object's password field
   *
   * @memberof User
   * @param   {string} password - incoming password
   * @returns {boolean} - password match or not
   */
module.exports.comparePassword = function (password, password_hash) {
  return bcrypt.compareSync(password, password_hash);
};

  /**
   * Generate JWT token
   *
   * @memberof User
   * @param   {null} null - nil
   * @returns {string} - JWT string
   */
module.exports.generateJWToken = function (data) {
    return jwt.sign(
      {
        userID: data.userID,
        email: data.email,
        firstname: data.firstname,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
  }

  /**
   * Verify JWT token
   *
   * @memberof User
   * @static
   * @param   {string} authToken - jwt token
   * @returns {object} - js object (id,firstname,email)
   */
module.exports.verifyAuthToken = function (authToken) {
    return jwt.verify(authToken, process.env.JWT_SECRET)
  }