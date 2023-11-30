const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BabyNameSchema = new Schema({
  name: { type: String, required: true },
  gender: {
    type: String,
    required: true,
    enum: ["Girl", "Boy", "Neutral"],
    default: "Neutral",
  },
  popularity: { type: Number, required: true, default: 0 },
});

// Virtual for babynameinstance's URL
BabyNameSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return "/babyName" + this._id;
});

// Export model
module.exports = mongoose.model("BabyName", BabyNameSchema);
