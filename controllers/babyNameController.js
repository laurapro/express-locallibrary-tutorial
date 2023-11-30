const BabyName = require("../models/babyName");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances, authors and genre counts (in parallel)
  const [numBabyNames] = await Promise.all([
    BabyName.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Local Library Home",
    baby_name_count: numBabyNames,
  });
});

// Function to fetch a random baby name
exports.fetchRandomBabyName = asyncHandler(async (req, res, next) => {
  const randomBabyName = await BabyName.aggregate([{ $sample: { size: 1 } }]);
  res.json(randomBabyName[0]);
});

// Function to update the popularity of a baby name
exports.updatePopularity = asyncHandler(async (req, res, next) => {
  try {
    const { name, increment } = req.body;

    // Find the baby name by name and update the popularity
    const updatedBabyName = await BabyName.findOneAndUpdate(
      { name: name },
      { $inc: { popularity: increment } },
      { new: true, writeConcern: { w: "majority" } }
    );

    if (!updatedBabyName) {
      return res.status(404).json({ error: "Baby name not found" });
    }

    res.json(updatedBabyName);
  } catch (error) {
    console.error("Error updating popularity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handle adding a new baby name
exports.addBabyName = asyncHandler(async (req, res, next) => {
  const { name, gender, popularity } = req.body;

  // Validate the input
  if (!name || !gender || popularity === undefined) {
    return res.status(400).json({
      message: "Invalid request. Please provide name, gender, and popularity.",
    });
  }

  // Create a new BabyName instance
  const babyName = new BabyName({ name, gender, popularity });

  try {
    // Save the baby name to the database
    const savedBabyName = await babyName.save();

    // Respond with the saved baby name
    res.status(201).json(savedBabyName);
  } catch (error) {
    console.error("Error adding baby name:", error);
    console.log("Response body:", await error.response.json()); // Add this line
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.getPopularityList = asyncHandler(async (req, res, next) => {
  const popularityList = await BabyName.find({}, "name popularity")
    .sort({ popularity: -1 })
    .exec();
  res.json(popularityList);
});

// Display list of all babyNames.
exports.babyName_list = asyncHandler(async (req, res, next) => {
  const allBabyNames = await BabyName.find({}, "name popularity gender")
    .sort({ name: 1 })
    .exec();

  res.json(allBabyNames);
});
