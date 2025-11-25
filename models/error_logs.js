const mongoose = require("mongoose");

const errorLogSchema = new mongoose.Schema(
  {
    function: String,
    file_name: String,
    folder_name: String,
    error: String,
    error_detail: String,
  },
  { timestamps: true, collection: "error_logs" }
);

module.exports = mongoose.model("ErrorLog", errorLogSchema);
