const messageModel = require("../Model/message.schema");
const ApiRes = require("../middleware/Api.res");
const ApiErr = require("../middleware/ApiErr");

const messageController = async (req, res) => {
  const { firstname, lastname, email, message, phone } = req.body;
  if (
    !firstname?.trim() ||
    !lastname?.trim() ||
    !email?.trim() ||
    !message?.trim() ||
    !phone
  ) {
    throw new ApiErr(400, "All Fields Are Required");
  }
  const messageCollection = await messageModel.create({
    firstname,
    lastname,
    email,
    message,
    phone,
  });
  res
    .status(201)
    .json(new ApiRes(201, "Message Sent Successfully", messageCollection));
};

const getAllMessages = async (req, res) => {
  const messages = await messageModel.find();
  res
    .status(200)
    .json(new ApiRes(200, "Messages Fetched Successfully", messages));
};

module.exports = { messageController, getAllMessages };
