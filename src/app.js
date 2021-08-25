// Importing packages
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Ensble CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, OPTIONS, DELETE, PUT,PATCH"
  );
  next();
});
// Link body parser for url reading
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "10gb",
  })
);
app.use(
  bodyParser.json({
    limit: "10gb",
  })
);

// Import routes
const { customers, payments, feedback, statements } = require("./routes");

// Initialize routes
app.use("/payments", payments);
app.use("/customers", customers);
app.use("/feedback", feedback);
app.use("/statements", statements);

module.exports = app;
