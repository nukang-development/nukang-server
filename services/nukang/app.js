const express = require("express");
const app = express();
const port = 4001;
const routes = require("./routes");
const errorhandler = require('./middlewares/errorHandler')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes);
app.use(errorhandler);

module.exports = app