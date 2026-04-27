const express = require("express");
const messageController = require("../Controller/messages.controller");
const asyncHandler = require("../middleware/asyncHandler");
const adminAuth = require("../middleware/userAuth");
const router = express.Router();
router.post("/send", asyncHandler(messageController.messageController));
router.get(
  "/get",
  asyncHandler(messageController.getAllMessages),
);
module.exports = router;
