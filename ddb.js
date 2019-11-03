const AWS = require("aws-sdk");

AWS.config.update({
  region: "localhost",
  endpoint: "http://localhost:9101"
});

const client = new AWS.DynamoDB.DocumentClient();
const TableName = "starbucks";

const DDB = (action, params) => {
  return client[action]({ TableName, ...params }).promise();
};

module.exports = DDB;
