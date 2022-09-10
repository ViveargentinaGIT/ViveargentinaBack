const express = require("express");
const regions = require("./routes/regions.js");
const categories = require("./routes/categories.js");
const experiences = require("./routes/experiences.js");
const package = require("./routes/packages.js");
const user = require("./routes/users.js");
const city = require("./routes/cities.js");
const query = require("./routes/queries.js");
const review = require("./routes/reviews.js");
const favorite = require("./routes/favorites.js");
const bought = require("./routes/bought.js");
const mercadopago = require("./routes/mercadopago.js");
const contactus = require("./routes/contactus.js")

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use("/regions", regions);
app.use("/categories", categories);
app.use("/experiences", experiences);
app.use("/packages", package);
app.use("/favorites", favorite);
app.use("/users", user);
app.use("/queries", query);
app.use("/reviews", review);
app.use("/cities", city);
app.use("/bought", bought);
app.use("/mercadopago", mercadopago);
app.use("/contactus", contactus)

module.exports = app;
