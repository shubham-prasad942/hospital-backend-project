const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const messageRouter = require("./Routes/routes");
const globalErrHandler = require("./middleware/ErrorMiddleware");
const userRouter = require("./Routes/userRouter");
const appointmentRouter = require("./Routes/appointmentRoutes");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", userRouter);
app.use("/api/get", userRouter);
app.use("/api/add", userRouter);
app.use("/api/select", appointmentRouter);
app.use("/api/get", appointmentRouter);
app.use("/api/update", appointmentRouter);
app.use("/api/delete", appointmentRouter);

app.use(globalErrHandler);

module.exports = app;
