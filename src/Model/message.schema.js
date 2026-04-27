const mongoose = require("mongoose");
const validator = require("validator");

const messageSchema = new mongoose.Schema(
  {
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
      required: true,
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
        message: "Phone Number Must Contain Exactly 10 Digits",
      },
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minLength: [5, "Message Must Contain At Least 5 Characters!"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Message", messageSchema);
