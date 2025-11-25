const mongoose = require("mongoose");

const ApiLogSchema = new mongoose.Schema(
  {
    method: { type: String },
    url: { type: String },
    user_id: { type: String },
    status: { type: Number },
    date: { type: String },
    content_length: { type: String },
    time: { type: String },
    request: { type: String },
    response: { type: String },
  },
  {
    timestamps: false,
    collection: "api_logs",
  }
);

module.exports = mongoose.model("ApiLog", ApiLogSchema);
