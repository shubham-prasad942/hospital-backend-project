const express = require("express");
const multer = require("multer");
const userRegisterController = require("../Controller/userRegister");
const userController = require("../Controller/userControllers");
const asyncHandler = require("../middleware/asyncHandler");
const userAuth = require("../middleware/userAuth");
const router = express.Router();
const uploadMiddleware = multer({ storage: multer.memoryStorage() });

//post
router.post("/register", asyncHandler(userRegisterController));
router.post("/login", asyncHandler(userController.patientLogin));
router.post(
  "/addnew",
  userAuth.isAdminAuthenticated,
  asyncHandler(userController.addAdmin),
);

//get
router.get(
  "/patients",
  userAuth.isAuthenticated,
  asyncHandler(userController.getMyPatients),
);
router.get("/doctors", asyncHandler(userController.getDoctors));
router.get(
  "/userdetails",
  userAuth.isAuthenticated,
  asyncHandler(userController.getUserDetail),
);
router.get(
  "/admindetails",
  userAuth.isAdminAuthenticated,
  asyncHandler(userController.getAdminDetail),
);
router.get("/logout", asyncHandler(userController.logOut));

router.post(
  "/doctor",
  userAuth.isAdminAuthenticated,
  uploadMiddleware.single("docAvatar"),
  asyncHandler(userController.addDoctor),
);

module.exports = router;
