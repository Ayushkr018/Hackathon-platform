const mongoose = require("mongoose");

let structuredConnection;
let unstructuredConnection;

const connectDB = async () => {
  try {
    // Structured DB connection
    structuredConnection = await mongoose.createConnection(
      process.env.MONGO_URI_STRUCTURED,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("✅ Connected to Structured DB");

    // Unstructured DB connection
    unstructuredConnection = await mongoose.createConnection(
      process.env.MONGO_URI_UNSTRUCTURED,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("✅ Connected to Unstructured DB");
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  getStructuredDB: () => structuredConnection,
  getUnstructuredDB: () => unstructuredConnection,
};