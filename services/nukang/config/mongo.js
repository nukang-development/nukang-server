const { MongoClient } = require("mongodb");
const url = process.env.MONGGO_DB_URL;
const client = new MongoClient(url, { useUnifiedTopology: true });
const dbName = "nukang";
client.connect();

const db = client.db(dbName);

module.exports = db;
