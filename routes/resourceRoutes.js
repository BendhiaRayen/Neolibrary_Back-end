const express = require("express");
const {
  addResource,
  getResources,
  deleteResource,
  getResourcesByCategory,
} = require("../controllers/resourceController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

// Add a resource
router.post("/", protect, restrictTo("admin"), addResource);

// Get all resources
router.get("/", protect, getResources);

// Get resources by category (use category name directly in URL)
router.get("/category/:categoryName", protect, getResourcesByCategory);

// Delete a resource
router.delete("/:id", protect, restrictTo("admin"), deleteResource);

module.exports = router;
