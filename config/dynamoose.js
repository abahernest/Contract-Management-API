const dynamoose = require("dynamoose");

function connectToDB() {
    dynamoose.aws.ddb.local(process.env.DYNAMO_DB_URL);
}

module.exports = connectToDB