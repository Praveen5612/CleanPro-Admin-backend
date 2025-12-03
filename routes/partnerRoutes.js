const express = require("express");
const router = express.Router();

const partnerController = require("../controllers/partnerController");
const verifyToken = require("../middleware/authMiddleware");

// CREATE
router.post(
  "/create",
  verifyToken,
  partnerController.createPartner
);

// GET ALL
router.get(
  "/",
  verifyToken,
  partnerController.getAllPartners
);

// GET ONE
router.get(
  "/:id",
  verifyToken,
  partnerController.getPartnerById
);

// UPDATE
router.put(
  "/update/:id",
  verifyToken,
  partnerController.updatePartner
);

// DELETE
router.delete(
  "/delete/:id",
  verifyToken,
  partnerController.deletePartner
);

module.exports = router;
