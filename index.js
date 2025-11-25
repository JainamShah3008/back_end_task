require("dotenv").config();
const express = require("express");
const app = express();

//DB connection
const connectDB = require("./config/db");
connectDB();

const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { join } = require("path");
const useragent = require("express-useragent");
const _ = require("lodash");

const { ApiLog } = require("./models/api_logs");

const HOST = process.env.HOST_URL || "localhost";
const PORT = process.env.HOST_PORT || 3000;

const publicFolders = [
  join(process.cwd(), "uploads", ".tmp"),
  join(process.cwd(), "uploads", "compress_files"),
];

// Serve static files from each public folder
publicFolders.forEach((publicFolder) => {
  app.use(express.static(publicFolder));
});

// disable `X-Powered-By` header that reveals information about the server
app.disable("x-powered-by");

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(bodyParser.json());

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: true }));

// enable cors
app.use(cors());

app.use(useragent.express());

// Generate Request & Response Logs
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    res.locals.responseJson = body;
    originalJson.call(this, body);
  };
  next();
});

morgan.token("response-json", (req, res) => {
  return JSON.stringify(res.locals.responseJson);
});

// app.use(
//   morgan(async (tokens, req, res) => {
//     const api = await ApiLog.create({
//       method: tokens.method(req, res) || null,
//       url: tokens.url(req, res) || null,
//       user_id: req?.user?.user_id,
//       status: tokens.status(req, res) || null,
//       date: tokens.date(req, res) || null,
//       content_length: tokens.res(req, res, "content-length") || null,
//       time: tokens["response-time"](req, res) + "ms" || null,
//       request: JSON.stringify(req?.body || req?.query) || null,
//       response: tokens["response-json"](req, res) || null,
//     });
//     if (api) {
//       console.log("Log successfully created");
//     } else {
//       console.log("Something wrong while create log!");
//     }
//   })
// );

const v1Route = require("./routes/v1");

app.use("/v1", v1Route);

app.use("/", (req, res) => {
  return res.json({ message: "Welcome to Backend Test Project." });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
