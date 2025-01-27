const express = require("express");
const {
  addSuggestion,
  getSuggestions,
  deleteSuggestion,
  upvoteSuggestion,
  downvoteSuggestion,
} = require("../controllers/suggestionController");
const { protect, restrictTo } = require("../controllers/authController"); // Correct import
const router = express.Router();

// Add a suggestion (Protected)
router.post("/", protect, addSuggestion);

// Get all suggestions (Protected)
router.get("/", protect, getSuggestions);

// Delete a suggestion (Protected)
router.delete("/:id", protect, restrictTo("admin"), deleteSuggestion);
router.patch("/:id/upvote", protect, upvoteSuggestion);
router.patch("/:id/downvote", protect, downvoteSuggestion);
module.exports = router;
