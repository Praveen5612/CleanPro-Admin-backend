const express = require("express");
const router = express.Router();
const cleanerController = require("../controllers/cleanerController");

// NO upload
// NO verifyToken (handled in server.js)

// CREATE cleaner
router.post("/", cleanerController.createCleaner);

// READ all
router.get("/", cleanerController.getAllCleaners);

// READ one
router.get("/:id", cleanerController.getCleanerById);

// UPDATE
router.put("/:id", cleanerController.updateCleaner);

// DELETE
router.delete("/:id", cleanerController.deleteCleaner);

module.exports = router;
