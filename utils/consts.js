exports.MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost/flavoral-app";

exports.postModelCategoryEnum = [
  "Commercial",
  "Technical Information",
  "General Information",
  "Accounting",
];
