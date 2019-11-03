#!/usr/bin/env node
const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const ddb = require("./ddb");

const InsertItem = row => {
  let range_key = row["State/Province"].toUpperCase();
  range_key += `#${row["City"].toUpperCase()}`;
  range_key += `#${row["Postcode"].toUpperCase()}`;

  const params = {
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

  return ddb("put", params);
};

const main = async () => {
  const csvText = fs.readFileSync("./directory.csv");
  const records = parse(csvText, { columns: true });

  let i = 1;
  const promises = [];
  for (i = 1; i <= records.length; i += 1) {
    promises.push(InsertItem(records[i - 1]));
    if (i % 500 === 0) {
      // wait for 500 put items to finish before
      // proceeding to the next
      await Promise.all(promises);
      promises.length = 0;
      console.log(`locations written: ${i}`);
      break;
    }
  }
  await Promise.all(promises);
  console.log(`locations written: ${i}`);
};

main();
