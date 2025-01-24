const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Store category as a string
  contributor: { type: String },
  link: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Resource", ResourceSchema);
