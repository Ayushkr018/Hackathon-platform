// backend/config/database.js
const mongoose = require("mongoose");

let structuredConnection;
let unstructuredConnection;

const required = (name) => {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
};

const connectDB = async () => {
  try {
    const uri = required("MONGO_URI"); // single SRV
    const dbStructured = required("DB_STRUCTURED"); // e.g., synaphack_structured
    const dbUnstructured = required("DB_UNSTRUCTURED"); // e.g., synaphack_unstructured

    const commonOptions = {
      // Modern defaults
      maxPoolSize: 30,
      serverSelectionTimeoutMS: 10_000,
      // Mongoose 7+ no longer needs useNewUrlParser/useUnifiedTopology
      // but they don't hurt if present. We'll omit them.
      autoIndex: false, // create indexes explicitly at bootstrap
    };

    // Connect to structured DB (logical DB on same cluster)
    structuredConnection = await mongoose.createConnection(uri, {
      ...commonOptions,
      dbName: dbStructured,
    });
    structuredConnection.on("error", (e) =>
      console.error("Structured DB error:", e.message)
    );
    structuredConnection.on("connected", () =>
      console.log(`✅ Connected to Structured DB (${dbStructured})`)
    );

    // Connect to unstructured DB (logical DB on same cluster)
    unstructuredConnection = await mongoose.createConnection(uri, {
      ...commonOptions,
      dbName: dbUnstructured,
    });
    unstructuredConnection.on("error", (e) =>
      console.error("Unstructured DB error:", e.message)
    );
    unstructuredConnection.on("connected", () =>
      console.log(`✅ Connected to Unstructured DB (${dbUnstructured})`)
    );

    // Quick ping to validate connectivity
    await Promise.all([
      structuredConnection.asPromise(),
      unstructuredConnection.asPromise(),
    ]);
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
