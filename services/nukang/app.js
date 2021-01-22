const express = require("express");
const app = express();
const port = 4001;
const routes = require("./routes");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`connected to ${port}`);
});
