import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./config/viewEngine.js";
import initWebRoutes from "./route/web.js";
require("dotenv").config();
// the above line is used to load environment variables from a .env file into process.env
import connectDB from "./config/connectDB.js";
import cors from "cors";

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ exrtend: true }));
app.user(cors({ origin: true }));

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
