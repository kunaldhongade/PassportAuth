const mongoose = require("mongoose");

require("dotenv").config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 *
 * DB_URL=mongodb://<user>:<password>@localhost:27017/database_name
 **/

const DB_URL = process.env.DB_URL;

const connection = mongoose
  .connect(DB_URL)
  .then((m) => {
    console.log(`connection to ${m.connection.name} successful`);
    return m.connection.getClient();
  })
  .catch((err) => {
    console.log(err);
  });

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// Expose the connection
module.exports = connection;
