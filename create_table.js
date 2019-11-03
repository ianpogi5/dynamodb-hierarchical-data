#!/usr/bin/env node
const AWS = require("aws-sdk");
const schema = require("./schema.json");

AWS.config.update({
  region: "localhost",
  endpoint: "http://localhost:9101"
});

const dynamodb = new AWS.DynamoDB();
dynamodb.createTable(schema, function(err) {
  if (err) console.log(err, err.stack);
  else console.log("Table created successfully!");
});
