/* eslint-disable no-undef */
//This section is used to get the current file’s directory name, which is useful for resolving paths.
import path from "path";
import { fileURLToPath } from 'url';
import cors from "cors"
import compression from "compression"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//
//express: Imports the Express framework.//json: Middleware for parsing JSON bodies.
import express, { json } from "express";
//morgan: HTTP request logger middleware.
import morgan from "morgan";
//dotenv / config: Loads environment variables from a.env file.
import 'dotenv/config';

import bdConnection from "./config/database.js";
import ApiError from "./utils/apiError.js";
import globalError from "./middleware/errorMiddleware.js";

// Routes
import { mountRoutes } from "./routes/mountRoutes.js";
import{webhookCheckout}from "./services/orderService.js"

const app = express();

app.use(cors());
app.options('*', cors());

// compress all reponse
app.use(compression());

//checkout webhook
app.post("/webhook-checkout", express.json({ type: 'application/json' }),webhookCheckout);
// Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}
// Middleware to parse JSON bodies
app.use(json());
// Serve static files from the "uploads" directory
app.use(express.static(path.join(__dirname, 'uploads')));

// Mount Routes

mountRoutes(app)



//This route handler is a great way to catch all undefined routes and pass them to your error handling middleware. Here’s a quick breakdown:
app.all("*", (req, res, next) => {
  //Create error and send it to error handling middleware
  next(new ApiError(`Can't find this route:${req.originalUrl}`, 400));
});

//global middleware for handling error (express )
app.use(globalError);

// Connect to DB
bdConnection();

const port = process.env.PORT || 3000;
const server= app.listen(port, () => {
  console.log(`the app listening on port ${port}!`);
});

//Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.log(`UnhandledRejectionErrors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log('Shutting down...');
    process.exit(1);
  })
});
