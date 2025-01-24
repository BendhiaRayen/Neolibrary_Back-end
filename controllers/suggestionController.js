const Suggestion = require("../models/Suggestion");
const mongoose = require("mongoose");
// Add a new suggestion
exports.addSuggestion = async (req, res) => {
  try {
    const { title, description, author } = req.body;

    // Create a new suggestion
    const suggestion = new Suggestion({ title, description, author });
    await suggestion.save();

    res
      .status(201)
      .json({ message: "Suggestion added successfully", suggestion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all suggestions
exports.getSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find().populate("author", "name");
    res.status(200).json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a suggestion

exports.deleteSuggestion = async (req, res) => {
  try {
    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find and delete the suggestion by ID
    const deletedSuggestion = await Suggestion.findByIdAndDelete(req.params.id);

    if (!deletedSuggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    res.status(200).json({ message: "Suggestion deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
