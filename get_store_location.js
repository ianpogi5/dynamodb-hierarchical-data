#!/usr/bin/env node
const ddb = require("./ddb");

const StoreNumber = process.argv[2] || "5860-29255";

const getStore = async () => {
  const params = {
    Key: { StoreNumber }
  };

  try {
    const data = await ddb("get", params);
    if (!data.Item) {
      console.log("Store not found.");
    } else {
      console.log("Store number found! Here's your store:\n", data.Item);
    }
  } catch (e) {
    console.log("Error getting item:", e);
  }
};

getStore();
