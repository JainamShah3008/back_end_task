const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postName: { type: String, required: true },
    description: { type: String, required: true },
    uploadTime: { type: Date, default: Date.now },
    tags: [{ type: String }],
    imageUrl: { type: String },
  },
  { timestamps: true }
);

postSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Post", postSchema);
