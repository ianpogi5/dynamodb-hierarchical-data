#!/usr/bin/env node
const ddb = require("./ddb");
const yargs = require("yargs");

const DEFAULT_COUNTRY = "US";
const DEFAULT_STATE = "NE";
const DEFAULT_CITY = "OMAHA";
const DEFAULT_POSTCODE = "68144";

const { argv } = yargs
  .usage("Usage: $0 [options]")
  .example("$0 --country US", "Show stores in the US")
  .option("country", {
    default: DEFAULT_COUNTRY,
    describe: "Country for stores to query",
    type: "string"
  })
  .option("state", {
    describe: "State abbreviation for stores to query",
    type: "string"
  })
  .option("city", {
    describe: "City for stores to query",
    type: "string"
  })
  .option("postcode", {
    describe: "Post code for stores to query",
    type: "string"
  })
  .option("default-state", {
    describe: "Use defaults to query at state level",
    type: "boolean"
  })
  .option("default-city", {
    describe: "Use defaults to query at city level",
    type: "boolean"
  })
  .option("default-postcode", {
    describe: "Use defaults to query at post code level",
    type: "boolean"
  })
  .option("count", {
    describe: "Post code for stores to query",
    type: "boolean"
  })
  .option("table", {
    describe: "Show output in table format",
    type: "boolean"
  });

const queryStore = async () => {
  const {
    country,
    defaultState,
    defaultCity,
    defaultPostcode,
    count,
    table
  } = argv;
  let state = argv.state;
  let city = argv.city;
  let postcode = argv.postcode;

  let infoMessage = `Querying locations in country ${country}`;
  let stateCityPostcode = "";

  if (defaultState) {
    state = DEFAULT_STATE;
  }
  if (defaultCity) {
    state = DEFAULT_STATE;
    city = DEFAULT_CITY;
  }
  if (defaultPostcode) {
    state = DEFAULT_STATE;
    city = DEFAULT_CITY;
    postcode = DEFAULT_POSTCODE;
  }
  if (state) {
    stateCityPostcode += state.toUpperCase();
    infoMessage += `, state ${state}`;
  }
  if (city && state) {
    stateCityPostcode += "#" + city.toUpperCase();
    infoMessage += `, city ${city}`;
  }
  if (postcode && city && state) {
    stateCityPostcode += "#" + postcode;
    infoMessage += `, postcode ${postcode}`;
  }

  console.log(infoMessage);

  let KeyConditionExpression = "Country = :country";
  let ExpressionAttributeValues = {
    ":country": country
  };

  if (stateCityPostcode) {
    KeyConditionExpression +=
      " AND begins_with(StateCityPostcode, :stateCityPostcode)";
    ExpressionAttributeValues[":stateCityPostcode"] = stateCityPostcode;
    console.log(
      `The key expression includes a begins_with() function with input of '${stateCityPostcode}'\n`
    );
  } else {
    console.log(
      "No stateCityPostcode specified. Retrieving all results in Country.\n"
    );
  }

  const params = {
    IndexName: "StoreLocationIndex",
    KeyConditionExpression,
    ExpressionAttributeValues
  };

  try {
    const data = await ddb("query", params);
    if (count) {
      console.log(`Retrieved ${data.Count} locations.`);
    } else if (table) {
      console.table(data.Items);
      console.log(`Count: ${data.Count}`);
    } else {
      console.log(data);
    }
  } catch (e) {
    console.log("Error running query", e);
  }
};

queryStore(argv);
