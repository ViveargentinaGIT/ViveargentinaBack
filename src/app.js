const express = require("express");
const regions = require("./routes/regions.js");
const administrators = require("./routes/administrators.js");
const categories = require("./routes/categories.js");
const experiences = require("./routes/experiences.js");
const package = require("./routes/packages.js");
const provider = require("./routes/providers.js");
const user = require("./routes/users.js");
const city = require("./routes/cities.js");
const query = require("./routes/queries.js");
const review = require("./routes/reviews.js");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use("/administrators", administrators);
app.use("/regions", regions);
app.use("/categories", categories);
app.use("/experiences", experiences);
app.use("/packages", package);
app.use("/providers", provider);
app.use("/users", user);
app.use("/queries", query);
app.use("/reviews", review);
app.use("/cities", city);

module.exports = app;
