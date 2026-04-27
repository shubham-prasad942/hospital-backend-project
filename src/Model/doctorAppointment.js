const mongoose = require("mongoose");
const validator = require("validator");
const appointment = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please Provide A Valid Email!"],
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: "Phone Number Must Contain Exactly 10 Digits!",
    },
  },
  aadhaar: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{12}$/.test(v);
      },
      message: "Aadhaar must contain exactly 12 digits!",
    },
  },
  dob: {
    type: Date,
    required: [true, "Dob is required!"],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: [true, "Gender is required!"],
  },
  appointment_date: {
    type: Date,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  hasVisited: {
    type: Boolean,
    default : false
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Appointment", appointment);
