import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";

import routes from "./routes.js";

import cookieParser from "cookie-parser";
import { auth } from "./middlewares/authMiddleware.js";

// Init express instance
const app = express();

// Add static middleware
app.use(express.static("./src/public"));

// Add body parser
app.use(express.urlencoded());

app.use(cookieParser());

app.use(auth);

// Add and config view engine
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    helpers: {
      showRating(rating) {
        return "★".repeat(Math.floor(rating));
        // return '&#x2605;'.repeat(Math.floor(rating));
      },
    },
    // Allow handlebars to use prototyp methods and properties of the base mongoose document
    runtimeOptions: {
      allowProtoMethodsByDefault: true,
      allowProtoPropertiesByDefault: true,
    },
  })
);

// Connect database
try {
  await mongoose.connect(
    `mongodb+srv://velin430:3C7a318e@cluster0.wwahnm9.mongodb.net/`,
    {
      dbName: "magic-movies",
    }
  );
  console.log("Successfully Conect to DB!");
} catch (err) {
  console.log("Cannot connect to DB!");
  console.log(err.message);
}

// Set default engine
app.set("view engine", "hbs");

// Set default view folder
app.set("views", "./src/views");

// Config routes
app.use(routes);

// Start express web server
app.listen(5000, () =>
  console.log("Server is listening on http://localhost:5000....")
);
