const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const appointmentController = require("../Controller/appointmentController");
const {
  isPatientAuthenticated,
  isAdminAuthenticated,
  isAuthenticated,
} = require("../middleware/userAuth");
const router = express.Router();

router.post(
  "/appointment",
  isPatientAuthenticated,
  asyncHandler(appointmentController.appointmentController),
);
router.get(
  "/appointment",
  isAuthenticated,
  asyncHandler(appointmentController.getAllAppointment),
);
router.patch(
  "/appointment/:id",
  asyncHandler(appointmentController.updateAppointment),
);

router.get("/patient/appointment/:id", isAuthenticated, appointmentController.getSingleAppointment)

router.delete("/appointment/:id", asyncHandler(appointmentController.deleteAppointment));

module.exports = router;
