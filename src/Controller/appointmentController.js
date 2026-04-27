const appointmentSchema = require("../Model/doctorAppointment");
const userSchema = require("../Model/UserSchema");
const ApiRes = require("../middleware/Api.res");
const ApiErr = require("../middleware/ApiErr");

const appointmentController = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    phone,
    aadhaar,
    dob,
    gender,
    appointment_date,
    department,
    hasVisited,
    doctorId,
    address,
    status,
  } = req.body;
  if (
    !firstname ||
    !lastname ||
    !email ||
    !phone ||
    !aadhaar ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    hasVisited === undefined ||
    !address
  ) {
    throw new ApiErr(400, "All required fields must be provided");
  }
  const patientId = req.user._id;
  if (!patientId) {
    throw new ApiErr(400, "Patient is not registered");
  }
  const doctor = await userSchema.findById(doctorId);
  if (!doctor) {
    throw new ApiErr(400, "doctor not found");
  }
  if (doctor.role !== "doctor") {
    throw new ApiErr(400, "Role is not doctor");
  }

  if (new Date(appointment_date) < new Date()) {
    throw new ApiErr(400, "Appointment date cannot be past");
  }

  const isAlreadyBooked = await appointmentSchema.findOne({
    doctorId,
    appointment_date,
  });
  if (isAlreadyBooked) {
    throw new ApiErr(400, "Doctor already booked for this time");
  }
  if (req.user.role !== "patient") {
    throw new ApiErr(400, "Only patient can book the appointment");
  }
  const appointment = await appointmentSchema.create({
    firstname,
    lastname,
    email,
    phone,
    aadhaar,
    dob,
    gender,
    appointment_date,
    department,
    address,
    status: status || "pending",
    patientId,
    doctorId,
  });
  res.status(201).json(new ApiRes(201, "Appointment created", appointment));
};

const getAllAppointment = async (req, res) => {
  const user = req.user;
  let query = {};
  if (user.role === "doctor") {
    query.doctorId = user._id;
  } else if (user.role === "patient") {
    query.patientId = user._id;
  } else if (user.role === "admin") {
    query = {};
  }
  const appointments = await appointmentSchema
    .find(query)
    .populate("doctorId", "firstname lastname department");
  res
    .status(200)
    .json(new ApiRes(200, "fetched all appointments", appointments));
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  let appointment = await appointmentSchema.findById(id);
  if (!appointment) {
    throw new ApiErr(404, "Appointment not found");
  }
  appointment = await appointmentSchema.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(new ApiRes(200, "Appointment updated", appointment));
};

const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  let appointment = await appointmentSchema.findById(id);
  if (!appointment) {
    throw new ApiErr(404, "Appointment not found");
  }
  appointment = await appointmentSchema.findByIdAndDelete(id);
  res.status(200).json(new ApiRes(200, "Appointment deleted", appointment));
};

const getSingleAppointment = async (req, res) => {
  const { id } = req.params;
  const appointment = await appointmentSchema
    .findById(id)
    .populate("doctorId", "firstname lastname department");
  if (!appointment) {
    throw new ApiErr(404, "Appointment not found");
  }
  res.status(200).json(new ApiRes(200, "Fetched appointment", appointment));
};

module.exports = {
  appointmentController,
  getAllAppointment,
  updateAppointment,
  deleteAppointment,
  getSingleAppointment,
};
