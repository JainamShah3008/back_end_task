const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// REMOVE unwanted fields from response globally
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.password;
    delete ret.__v;
    delete ret.updatedAt;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
