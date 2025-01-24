const mongoose = require("mongoose");

const SuggestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  votes: { type: Number, default: 0 },
  comments: [{ type: String }],
});

module.exports = mongoose.model("Suggestion", SuggestionSchema);
