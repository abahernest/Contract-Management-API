const { v4: uuid4 } = require("uuid");
const dynamoose = require("dynamoose");

const logger = require("../../config/logger.js")
const Contract = require("../models/contract.model.js");

module.exports.FetchAll = async (req, res) => {
    try{
        const contracts =await Contract.scan()
          .attributes(["contractID"])
          .exec();

        return res.send(
            200,
            JSON.stringify({
                code: 200,
                error: false,
                data: contracts
            })
        );
    }catch(err) {
      logger.error(err);
      return res.send(
        500,
        JSON.stringify({
          code: 500,
          error: true,
          message: err.message,
        })
      );
    };
};

module.exports.FetchById = async (req, res) => {
    try{
        const queryAvailable = req.event.queryStringParameters != null;
        if (queryAvailable){
            const { id } = req.event.queryStringParameters;
            const contracts = await Contract.query(
              new dynamoose.Condition().where("contractID").eq(id)
            ).attributes([
                "contractID",
                "contractName",
                "templateID",
                "userID",
              ])
            .exec();

            return res.send(
                200,
                JSON.stringify({
                    code: 200,
                    error: false,
                    data: contracts[0]
                })
            );
        }
        
        const contracts = await Contract.scan()
          .attributes(["contractID", "contractName", "templateID", "userID"])
          .exec();

        return res.send(
            200,
            JSON.stringify({
            code: 200,
            error: false,
            data: contracts,
            })
        );
    }catch(err) {
      logger.error(err);
      return res.send(
        500,
        JSON.stringify({
          code: 500,
          error: true,
          message: err.message,
        })
      );
    };
};

module.exports.NewContract = async (req, res) => {
    try{
        const { userID, contractName, templateID } = req.event.body;

        const contractID = uuid4();
        const contract = await Contract.create({contractID,userID,contractName, templateID})
        return res.send(
            200,
            JSON.stringify({
            code: 200,
            error: false,
            data: {contractID: contract.contractID},
            })
        );
    }catch(err) {
      logger.error(err);
      return res.send(
        500,
        JSON.stringify({
          code: 500,
          error: true,
          message: err.message,
        })
      );
    }
};
