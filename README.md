# DynamoDB Hierarchical Data

Found a very nice [tutorial](https://www.dynamodbguide.com/hierarchical-data) by [Alex DeBrie](https://github.com/alexdebrie) about [Modeling Hierarchical Data](https://www.dynamodbguide.com/hierarchical-data)  with [DynamoDB](https://aws.amazon.com/dynamodb/).

The tutorial uses [Python code](https://github.com/alexdebrie/dynamodbguide.com/tree/master/examples/starbucks). I converted them into javascript equivalent and added some scripts to make it easier to setup and play around using [Node.js](https://nodejs.org/en/).

## Before you start

Same as the [original tutorial](https://www.dynamodbguide.com/hierarchical-data) you'll need to download [Starbucks locations dataset](https://www.kaggle.com/starbucks/store-locations) from Kaggle. Unzip it, and move the CSV file into your working directory as directory.csv.

You'll need nodejs 10 or above and docker. Docker is for [Dynamodb-local](https://hub.docker.com/r/amazon/dynamodb-local) and [dynamodb-manager](https://hub.docker.com/r/taydy/dynamodb-manager/)  so you can test it on local.

WARNING: DO NOT TEST ON REAL DYNAMODB AS IT MAY COST YOU MONEY!

## Setup DynamoDB-local

```bash
git clone https://github.com/ianpogi5/dynamodb-hierarchical-data.git
cd dynamodb-hierarchical-data
npm init
npm setup
```

This will enable two endpoints:

* [http://localhost:9100](http://localhost:9100) - [Dynamodb manager](https://hub.docker.com/r/taydy/dynamodb-manager/)
* http://localhost:9101 - [Dynamodb-local](https://hub.docker.com/r/amazon/dynamodb-local) 

## Loading the Table

```bash
node seed.js
```

This command will take a few minutes to finish.

## Retrieve Item

```bash
node get_store_location.js 32758-139745
```

## Gather queries

```bash
node query_store_locations.js --country PH --state 41 --count
```

Please follow the [original tutorial](https://www.dynamodbguide.com/hierarchical-data) to make sense of this repository.
