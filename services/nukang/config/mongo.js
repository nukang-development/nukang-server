const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const client = new MongoClient(url, { useUnifiedTopology: true });
const dbName = "nukang";
client.connect();

const db = client.db(dbName);

module.exports = db;
