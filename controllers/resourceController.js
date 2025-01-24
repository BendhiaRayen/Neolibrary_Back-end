const Resource = require("../models/Resource");
const mongoose = require("mongoose");
// Add a new resource
exports.addResource = async (req, res) => {
  try {
    const { title, description, category, contributor, link } = req.body;

    // Create a new resource
    const resource = new Resource({
      title,
      description,
      category,
      contributor,
      link,
    });
    await resource.save();

    res.status(201).json({ message: "Resource added successfully", resource });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all resources
exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate("contributor", "name");
    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a resource
exports.deleteResource = async (req, res) => {
  try {
    // Find and delete the resource by ID
    const deletedResource = await Resource.findByIdAndDelete(req.params.id);

    if (!deletedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getResourcesByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    // Find resources that belong to the specified category
    const resources = await Resource.find({ category: categoryName });

    if (!resources.length) {
      return res
        .status(404)
        .json({ message: "No resources found for this category" });
    }

    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
