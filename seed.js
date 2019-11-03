const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const AWS = require("aws-sdk");

AWS.config.update({
  region: "localhost",
  endpoint: "http://localhost:9101"
});

const client = new AWS.DynamoDB.DocumentClient();
const TableName = "starbucks";

const InsertItem = row => {
  let range_key = row["State/Province"].toUpperCase();
  range_key += `#${row["City"].toUpperCase()}`;
  range_key += `#${row["Postcode"].toUpperCase()}`;

  const params = {
    TableName: TableName,
    Item: {
      Country: row["Country"] || null,
      State: row["State/Province"] || null,
      City: row["City"] || null,
      Postcode: row["Postcode"] || null,
      StateCityPostcode: range_key,
      StoreNumber: row["Store Number"] || null,
      StoreName: row["Store Name"] || null,
      StreetAddress: row["Street Address"] || null,
      Latitude: row["Latitude"] || null,
      Longitude: row["Longitude"] || null,
      PhoneNumber: row["Phone Number"] || null
    }
  };

  return client.put(params).promise();
};

const main = async () => {
  const initTime = new Date().getTime();
  let startTime = 0;
  let endTime = 0;
  const csvText = fs.readFileSync("./directory.csv");
  const records = parse(csvText, { columns: true });

  let i = 1;
  const promises = [];
  startTime = new Date().getTime();
  for (i = 1; i <= records.length; i += 1) {
    promises.push(InsertItem(records[i - 1]));
    if (i % 500 === 0) {
      await Promise.all(promises);
      endTime = new Date().getTime();
      promises.length = 0;
      console.log(`locations written: ${i}`);
      console.log(`Duration: ${endTime - startTime}`);
      startTime = new Date().getTime();
    }
  }
  await Promise.all(promises);
  console.log(`locations written: ${i - 1}`);
  endTime = new Date().getTime();
  console.log(`Duration: ${endTime - startTime}`);
  console.log(`Total Duration: ${endTime - initTime}`);
};

main();
