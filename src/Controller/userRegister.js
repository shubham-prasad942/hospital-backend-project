const userSchema = require("../Model/UserSchema");
const ApiRes = require("../middleware/Api.res");
const ApiErr = require("../middleware/ApiErr");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRegister = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    phone,
    aadhaar,
    dob,
    gender,
    password,
    role,
    doctorDepartment,
    docAvatar,
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
    !role
  ) {
    throw new ApiErr(400, "All required fields must be provided");
  }
  const existingEmail = await userSchema.findOne({ email });
  if (existingEmail) {
    throw new ApiErr(400, "Email already registered");
  }
  const existingPhone = await userSchema.findOne({ phone });
  if (existingPhone) {
    throw new ApiErr(400, "Phone number already registered");
  }
  const existingAadhaar = await userSchema.findOne({ aadhaar });
  if (existingAadhaar) {
    throw new ApiErr(400, "Aadhaar already registered");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await userSchema.create({
    firstname,
    lastname,
    email,
    phone,
    aadhaar,
    dob,
    gender,
    password: hashPassword,
    role,
    doctorDepartment,
    docAvatar,
  });
  const token = await jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES },
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(201).json(new ApiRes(201, "new user created", user));
};
module.exports = userRegister;
