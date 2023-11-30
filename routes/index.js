const express = require("express");
const router = express.Router();
const path = require("path");

// Require controller modules.
const babyNameController = require("../controllers/babyNameController");

// GET home page.
router.get("/", babyNameController.index);

router.get("/fetchRandomBabyName", babyNameController.fetchRandomBabyName);

router.get("/getList", babyNameController.babyName_list);

router.post("/babyNames/updatePopularity", babyNameController.updatePopularity);

router.post("/addBabyName", babyNameController.addBabyName);

router.get("/getPopularityList", babyNameController.getPopularityList);

// Serve the index.html file
router.get("/index.html", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = router;
