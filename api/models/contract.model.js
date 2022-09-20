const dynamoose = require("dynamoose");
const User = require("./user.model.js");

const schema = new dynamoose.Schema({
    contractID: {
        type: String,
        hashKey: true,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    contractName: {
        type: String,
        required: true
    },
    templateID: {
        type: String,
        required: true
    }
},{timestamps:true})

module.exports = dynamoose.model("Contract",schema)