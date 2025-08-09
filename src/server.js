import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./config/viewEngine.js";
import initWebRoutes from "./route/web.js";
require("dotenv").config();
// the above line is used to load environment variables from a .env file into process.env
import connectDB from "./config/connectDB.js";
import cors from "cors";

/* Config cors issue with import the external library
Using middleware : 
Middleware mechanism: 
Ususally, client -> call api -> controller

=> With middleware, client => call api => call api => middleware => controller


*/

// Add headers
let app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// app.use(express.json()); // <-- This is required for JSON POST bodies
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend origin
    credentials: true,
  })
);

configViewEngine(app);
initWebRoutes(app);
connectDB(); // connect to database
// Must be follow the order of the above line
// Before connecting to the database, we need to configure the view engine and the routes and the body parser
// After connecting to the database, we ensure that the port is set and the server is running

let port = process.env.PORT || 6969;

app.listen(port, () => {
  // callback
  console.log("Backend Nodejs is running on the port: " + port);
});
