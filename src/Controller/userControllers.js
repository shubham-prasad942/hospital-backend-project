const userSchema = require("../Model/UserSchema");
const ApiRes = require("../middleware/Api.res");
const ApiErr = require("../middleware/ApiErr");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../Storage/storage.server");
const appointmentSchema = require("../Model/doctorAppointment");
const mongoose = require("mongoose")

const patientLogin = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    throw new ApiErr(400, "All required fields must be provided");
  }
  const userExist = await userSchema.findOne({
    $or: [{ email }],
  });
  if (!userExist) {
    throw new ApiErr(400, "User Does Not Exist");
  }
  if (userExist.role !== role) {
    throw new ApiErr(400, "role does not match");
  }
  const isMatch = await bcrypt.compare(password, userExist.password);
  if (!isMatch) {
    throw new ApiErr(400, "Password Does Not Match");
  }
  const token = jwt.sign(
    { id: userExist._id, role: userExist.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES,
    },
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res
    .status(200)
    .json(new ApiRes(200, "User logged in successfully", userExist));
};

const addAdmin = async (req, res) => {
  const { firstname, lastname, email, phone, aadhaar, dob, gender, password } =
    req.body;
  if (
    !firstname ||
    !lastname ||
    !email ||
    !phone ||
    !aadhaar ||
    !dob ||
    !gender ||
    !password
  ) {
    throw new ApiErr(400, "All required fields must be provided");
  }
  const adminExist = await userSchema.findOne({
    $or: [{ email }, { phone }, { aadhaar }],
  });
  if (adminExist) {
    throw new ApiErr(400, "Admin already exist");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const admin = await userSchema.create({
    firstname,
    lastname,
    email,
    phone,
    password: hashPassword,
    gender,
    dob,
    aadhaar,
    role: "admin",
  });
  const token = await jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES },
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(201).json(new ApiRes(201, "Admin created successfully", admin));
};

const getDoctors = async (req, res) => {
  const doctors = await userSchema.find({ role: "doctor" });
  res
    .status(200)
    .json(new ApiRes(200, "Doctors fetched successfully", doctors));
};

const getUserDetail = async (req, res) => {
  const user = req.user;
  res.status(200).json(new ApiRes(200, "user fetched successfully", user));
};

const getAdminDetail = async (req, res) => {
  const admin = req.user;
  res.status(200).json(new ApiRes(200, "admin fetched successfully", admin));
};

const logOut = async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 0,
    })
    .json(new ApiRes(200, "User logged out successfully"));
};

const addDoctor = async (req, res) => {
  if (!req.file) {
    throw new ApiErr(400, "Image is required");
  }
  const {
    firstname,
    lastname,
    email,
    phone,
    aadhaar,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;
  if (
    !firstname ||
    !lastname ||
    !email ||
    !phone ||
    !aadhaar ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment
  ) {
    throw new ApiErr(400, "All required fields must be provided");
  }
  const image = await upload(req.file);
  const hashPassword = await bcrypt.hash(password, 10);
  const doctor = await userSchema.create({
    firstname: firstname,
    lastname: lastname,
    email: email,
    phone: phone,
    password: hashPassword,
    gender: gender,
    dob: dob,
    aadhaar: aadhaar,
    role: "doctor",
    doctorDepartment: doctorDepartment,
    docAvatar: {
      id: image.fileId,
      url: image.url,
    },
  });
  console.log(image);
  console.log(image.url);
  res.status(200).json(new ApiRes(200, "New doctor created", doctor));
};

const getMyPatients = async (req, res) => {
  const user = req.user;
  if (user.role !== "doctor") {
    throw new ApiErr(403, "Only doctor can access patients");
  }
  const patients = await appointmentSchema.aggregate([
    {
      $match: {
        doctorId: new mongoose.Types.ObjectId(user._id),
      },
    },
    {
      $group: {
        _id: "$patientId",
        totalAppointments: { $sum: 1 },
        lastVisit: { $max: "$appointment_date" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "patient",
      },
    },
    {
      $unwind: {
        path: "$patient",
        preserveNullAndEmptyArrays: true,
      },
    },
    // temporarily REMOVE this while debugging
    // {
    //   $match: { "patient.role": "patient" },
    // },
    {
      $project: {
        _id: "$patient._id",
        firstname: "$patient.firstname",
        lastname: "$patient.lastname",
        phone: "$patient.phone",
        gender: "$patient.gender",
        email: "$patient.email",
        lastVisit: 1,
        totalAppointments: 1,
        hasVisited: { $gt: ["$totalAppointments", 0] },
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiRes(200, "Patients fetched successfully", patients));
};

module.exports = {
  patientLogin,
  addAdmin,
  getDoctors,
  getUserDetail,
  getAdminDetail,
  logOut,
  addDoctor,
  getMyPatients,
};
